// Function to retrieve About-Diabetes page
const getAboutDiabetes = (req,res) => {
    if (req.user.role == "patient") {
        // patient is logged in, so show "Dashboard" and "Sign Out" button
        return res.render('aboutDiabetes', {logged: true, role: "patient"})
    }
    else {
        // clinician is logged in, so show "Dashboard" and "Sign Out" button
        return res.render('aboutDiabetes', {logged: true, role: "clinician"})
    }
}

// Function to retrieve About-Dextrack page
const getAboutDexTrack = (req,res) => {

    if (req.user.role == "patient") {
        /// patient is logged in, so show "Dashboard" and "Sign Out" button
        return res.render('aboutDexTrack', {logged: true, role: "patient"})
    }
    else {
        // clinician is logged in, so show "Dashboard" and "Sign Out" button
        return res.render('aboutDexTrack', {logged: true, role: "clinician"})
    }
}

// Function to logout patient/clinician with the "Sign Out" button
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