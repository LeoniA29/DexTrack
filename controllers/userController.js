// Function to retrieve About-Diabetes page
const getAboutDiabetes = (req,res) => {
    // User is logged in, so show "Dashboard" and "Sign Out" button
    return res.render('aboutDiabetes', {logged: true})
}

// Function to retrieve About-Dextrack page
const getAboutDexTrack = (req,res) => {
    // User is logged in, so show "Dashboard" and "Sign Out" button
    return res.render('aboutDexTrack', {logged: true})
}

// Function to logout patient with the "Sign Out" button
const userLogout = (req,res)=>{
    req.logout()
    res.redirect('/')
}

// Function to retrieve login page
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