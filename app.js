app.engine('hbs', exphbs.engine({      // configure Handlebars
    defaultlayout: 'main',extname: 'hbs'
}))
app.set('view engine', 'hbs')   // set Handlebars view engine
