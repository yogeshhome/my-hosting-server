const ApiRoutes = {
    LOGIN:{
        path:'/user/login',
        authenticate:false
    },
    SIGNUP:{
        path:'/user/signup',
        authenticate:false
    },
    USERS:{
        path:'/user',
        authenticate:true
    },
    ASSETS:{
        path:'/user/allassets',
        authenticate:true
    },
    AddAsset:{
        path:'/user/addassets',
        authenticate:true
    },
    DeleteAsset:{
        path:"/user/deleteasset/:id",
        authenticate:true
    },
    EditAsset:{
        path:"/user/allassets/:id",
        authenticate:true
    },
    GetAssetById:{
        path:"/user/editasset/:id",
        authenticate:true
    },
    Billform:{
        path:'/user/generate-bill',
        authenticate:true
    }
    
}

export default ApiRoutes