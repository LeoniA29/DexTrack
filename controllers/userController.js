
const getAboutDiabetes = (req,res) => {
    return res.render('aboutDiabetes', {logged: true})
}

const getAboutDexTrack = (req,res) => {
    return res.render('aboutDexTrack', {logged: true})
}

const userLogout = (req,res)=>{
    req.logout()
    res.redirect('/')
}

const getIndex = (req, res) => {
    res.render('index.hbs')
}


// exports objects containing functions imported by router
module.exports = {
    getAboutDiabetes,
    getAboutDexTrack,
    userLogout,
    getIndex
}