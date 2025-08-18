import UserModel from '../models/user.js';
import assetsModel from '../models/asset.js'
import BillModel from '../models/bill.js'
import Auth from '../utils/auth.js'
import fs from 'fs'
import PDFDocument from 'pdfkit'
import path from 'path';
import { fileURLToPath } from 'url';
import { console } from 'inspector';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getNextBillNo = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 

    const lastBill = await BillModel.findOne().sort({ billDate: -1 });

    if (!lastBill || (lastBill.billDate.getMonth() + 1 !== currentMonth)) {
        return 1; 
    }

    return lastBill.billNo + 1;
};

const updateStockAfterBill = async (items) => {
    try {
        for (const item of items) {
            await assetsModel.findOneAndUpdate(
                { a_id: item.a_id },
                { $inc: { a_stock: -item.quantity, a_sales: item.quantity } },
                { new: true }
            );
        }
        console.log("Stock quantities updated successfully.");
    } catch (err) {
        console.error("Error updating stock quantities: ", err);
        throw new Error('Error updating stock quantities');
    }
};

const pdfGenerator = async (req, res) => {
    const { customer, items, totalAmount ,company_name} = req.body;

    try {
        const nextBillNo = await getNextBillNo();


        const doc = new PDFDocument({ size: 'A4', margin: 50 });
         // Set headers to trigger a download
         res.setHeader('Content-Type', 'application/pdf');
         res.setHeader('Content-Disposition', `attachment; filename="invoice_${nextBillNo}.pdf"`);

        
 
         // Pipe the document directly to the response to trigger download
         doc.pipe(res);
 
         // Generate the PDF content
         generateHeader(doc, nextBillNo);
         generateCustomerInformation(doc, customer);
         generateInvoiceTable(doc, items, totalAmount, nextBillNo);
         
         doc.end();
 
         // Update stock and save bill in database
         await updateStockAfterBill(items);

        

        let totalProfit = 0;
        const enrichedItems = await Promise.all(items.map(async (item) => {
            const asset = await assetsModel.findOne({ a_id: item.a_id });
            if (!asset) {
                throw new Error(`Asset with ID ${item.a_id} not found`);
            }

            const profit = ((item.price * 1.18) - asset.purchase_price) * item.quantity;
            totalProfit += profit;

            return {
                a_id: item.a_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                profit: profit
            };
        }));

        const newBill = new BillModel({
            billNo: nextBillNo,
            customer: customer.customerName,
            company_name:company_name,
            items: enrichedItems,
            totalAmount: totalAmount,
            totalProfit: totalProfit
        });

        await newBill.save();

        
    } catch (error) {
        res.status(500).send({
            message: 'Error generating bill, updating stock, or saving bill with profit',
            error: error.message
        });
    }
};

function generateHeader(doc, billNo) {
    doc
        .fontSize(10)
        .text('Tax Invoice', 265, 10)
        .image(path.join(__dirname, 'logo.png'), 50, 45, { width: 50 })
        .fillColor('#444444')
        .fontSize(20)
        .text('KSKARTHIK HARDWARES', 110, 50)
        .text(`Bill No: ${billNo}`, 200, 65, { align: 'right' })
        .fontSize(10)
        .text('348/1 Kalugumalai main road', 50, 105, { align: 'left' })
        .text('Nalattinputhur, Tamilnadu-628716', 50, 120, { align: 'left' })
        .text('GSTIN/UIN- 33EBOPK8987B1Z6', 50, 135, { align: 'left' })
        .text('Contact-  8754922363', 50, 150, { align: 'left' })
        .text('Email- ksk@gmail.com', 50, 165, { align: 'left' })
        .moveDown();
}

function generateBillNoEveryPage(doc, billNo) {
    doc
        .fontSize(10)
        .text('Tax Invoice', 265, 10)
        
        .fillColor('#444444')
        .fontSize(20)
        .text(`Bill No: ${billNo}`, 200, 25, { align: 'right' })
        .moveDown();
}

function generateCustomerInformation(doc, { customerName, customerAddress, customerGST }) {
    doc
        .fillColor('#444444')
        .fontSize(15)
        .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, 215);

    doc
        .fontSize(10)
        .text('Buyer(Bill to)', 50, 245)
        .text(`Customer Name: ${customerName}`, 50, 265)
        .text(`Customer Address:${customerAddress}`, 50, 280, { align: 'left' });

    if (customerGST) {
        doc.text(`GSTIN/UIN-${customerGST}`, 50, 295, { align: 'left' });
    }

    doc.moveDown();
}

function generateInvoiceTable(doc, items, totalAmount, billNo) {
    let i;
    const invoiceTableTop = 330;
    const taxRate = 0.09;
    let position = invoiceTableTop + 20;

    drawTableLine(doc, invoiceTableTop - 5);
    doc.font('Helvetica-Bold');
    generateTableRow(doc, invoiceTableTop, 'Item', 'Quantity', 'Unit Price', 'Total');
    drawTableLine(doc, invoiceTableTop + 15);
    doc.font('Helvetica');

    for (i = 0; i < items.length; i++) {
        const item = items[i];

        if (position > 700) {
            doc.addPage();
            generateBillNoEveryPage(doc, billNo);
            
            position = 50;
        }

        generateTableRow(doc, position, item.name, item.quantity, `${item.price.toFixed(2)}`, `${(item.quantity * item.price).toFixed(2)}`);
        drawTableLine(doc, position + 20);
        position += 30;
    }

    const subtotal = totalAmount;
    if (position > 700) {
        doc.addPage();
        generateBillNoEveryPage(doc, billNo);
        
        position = 50;
    }

    generateTotalRow(doc, position + 30, 'Subtotal', subtotal);
    drawTableLine(doc, position + 45);

    const cgst = subtotal * taxRate;
    const sgst = subtotal * taxRate;
    const grandTotalBeforeTaxes = subtotal + cgst + sgst;

    generateTaxRow(doc, position + 60, 'CGST (9%)', cgst);
    drawTableLine(doc, position + 75);
    generateTaxRow(doc, position + 90, 'SGST (9%)', sgst);
    drawTableLine(doc, position + 105);

    generateTotalRow(doc, position + 120, 'Grand Total', grandTotalBeforeTaxes);
    drawTableLine(doc, position + 135);

    generateFooter(doc);
}

function generateTableRow(doc, y, item, quantity, unitPrice, total) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(quantity, 200, y, { width: 90, align: 'right' })
        .text(unitPrice, 300, y, { width: 90, align: 'right' })
        .text(total, 400, y, { width: 90, align: 'right' });
}

function generateTotalRow(doc, y, label, amount) {
    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(label, 300, y, { width: 90, align: 'right' })
        .text(`${amount.toFixed(2)}`, 400, y, { width: 90, align: 'right' });
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text('"We were all in the field tying up sheaves of wheat, when my sheaf got up and stood up straight. Yours formed a circle round mine and bowed down to it."', 50, 730, { align: 'center', width: 500 })
        .text('Genesis 37:7',50, 760, { align: 'center', width: 500 })
}

function generateTaxRow(doc, y, taxType, taxAmount) {
    doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(taxType, 300, y, { width: 90, align: 'right' })
        .text(`${taxAmount.toFixed(2)}`, 400, y, { width: 90, align: 'right' });
}

function drawTableLine(doc, y) {
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

export { pdfGenerator };




const getAllUsers = async (req, res) => {
    try {
        let users = await UserModel.find({}, { password: 0 })
        res.status(200).send({
            message: "Data Fetch Successful",
            users
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}

const getAllAssets = async (req, res) => {
    try {

        let assets = await assetsModel.find();

        if (assets) {
            res.status(200).send({
                message: "Data Fetch Successful",
                assets
            })
        } else {
            res.status(400).send({
                message: "No data"
            })
        };
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        });
    }
};

const addAssets = async (req, res) => {
    try {
        let assets = await assetsModel.findOne({ a_id: req.body.a_id, company_name: req.body.company_name })

        if (!assets) {

            await assetsModel.create(req.body)
            res.status(201).send({
                message: "Asset added Successfull"
            })
        }
        else {
            res.status(400).send({
                message: `Asset Id with ${req.body.a_id} already exists`
            })
        }

    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}
const editAssets = async (req, res) => {
    try {
        let assets = await assetsModel.findOne({ _id: req.params.id });
        if (assets) {
            assets.a_id = req.body.a_id
            assets.a_name = req.body.a_name
            assets.a_sales = req.body.a_sales
            assets.a_stock = req.body.a_stock
            assets.stock_last_update = Date.now()

            await assets.save()

            res.status(201).send({
                message: "Updated Successfull"
            })
        }
        else {
            res.status(400).send({
                message: `Internal Server Error`
            })
        }

    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}
const deleteAsset = async (req, res) => {
    try {
        let asset = await assetsModel.findOne({ _id: req.params.id });

        if (asset) {
            let asset = await assetsModel.deleteOne({ _id: req.params.id })
            res.status(200).send({
                message: "Asset Deleted Successfully",
                asset
            })
        }
        else {
            res.status(400).send({
                message: "The Asset does not exist"
            })
        }
    }
    catch (error) {
        res.status(500).send({
            message: error.message || "Internal server error"
        })
    }
}

const getAssetById = async (req, res) => {
    try {
        let asset = await assetsModel.findOne({ _id: req.params.id }, { password: 0 })
        res.status(200).send({
            message: "Data Fetch Successful",
            asset
        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}

const signUp = async (req, res) => {
    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            req.body.password = await Auth.hashPassword(req.body.password)
            await UserModel.create(req.body)
            res.status(201).send({
                message: "User Sign Up Successfull"
            })
        }
        else {
            res.status(400).send({
                message: `Assets with ${req.body.email} already exists`
            })
        }

    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}

const login = async (req, res) => {
    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (user) {
            if (await Auth.hashCompare(req.body.password, user.password)) {
                let token = await Auth.createToken({
                    name: user.name,
                    email: user.email,
                    cp_name: user.companyName,
                    id: user._id,
                    role: user.role,
                })

                res.status(200).send({
                    message: "Login Successfull",
                    name: user.name,
                    role: user.role,
                    id: user._id,
                    cp_name: user.companyName,
                    token
                })
            }
            else {
                res.status(400).send({
                    message: "Incorect Password"
                })
            }
        }
        else {
            res.status(400).send({
                message: `User with ${req.body.email} does not exists`
            })
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}

export default {
    getAllUsers,
    getAssetById,
    signUp,
    login,
    addAssets,
    editAssets,
    deleteAsset,
    getAllAssets,
    pdfGenerator
}