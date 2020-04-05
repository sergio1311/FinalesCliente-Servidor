let express = require('express');
let router = express.Router();

let Zombie = require('../models/zombie');
let Cerebro = require('../models/cerebro');
let Usuario = require("../models/usuario");

var bcrypt = require('bcrypt');
const saltRounds = 10;

//Zombies

router.get('/zombies', async(req,res) => {
    if(req.query.q === 'Administrador'){
     Zombie.find().exec((error,zombies) => {
        if(!error)
        {
            res.status(200).json(zombies);
        }
        else
        {
            res.status(500).json(error);
        }
    });
    }else{
       Zombie.find().where('userId').equals(req.query.p).exec((error,zombies) => {
        if(!error)
        {
            res.status(200).json(zombies);
        }
        else
        {
            res.status(500).json(error);
        }
    });
    }
 
});


//Add

router.post('/zombies/new', function(req, res) {
    var data = req.body;
    var nuevoZombie = new Zombie({
        name: data.name,
        email: data.email,
        type: data.type,
        userId: data.userId
    });
    var json = [];
    var id = 0;
    if (nuevoZombie.name == "" || nuevoZombie.name == undefined || nuevoZombie.type == "" || nuevoZombie.type == undefined
              || nuevoZombie.userId == undefined || nuevoZombie.userId =="") {
        id++;
        json.push({ "mensaje": "Faltan datos de llenar", "id": id });
        res.status(500).json({ mensajeError: json });
    } else {
        nuevoZombie.save(function(error) {
            if (error) {

                if (error.errors.name) {
                    id++;
                    json.push({ "mensaje": error.errors.name.message, "id": id });
                }
                if (error.errors.email) {
                    id++;
                    json.push({ "mensaje": error.errors.email.message, "id": id });
                }
                if (error.errors.type) {
                    id++;
                    json.push({ "mensaje": "Tipo de zombie no valido", "id": id });
                }
                if (error.errors.userId) {
                    id++;
                    json.push({ "mensaje": error.errors.userId.message, "id": id });
                }
                res.status(500).json({ mensajeError: json });
            } else {
                listadoZombies("El Zombie se ha insertado correctamente", "alert-success", req, res);
            }
        });
    }
});

//Editar

router.put('/zombies/edit/:id', async function(req, res) {
    var json = [];
    var id = 0;
    try {
        var zombie = await Zombie.findById(req.params.id);
        zombie.name = req.body.name;
        zombie.email = req.body.email;
        zombie.type = req.body.type;
        await zombie.save();
        listadoZombies("Zombie modificado correctamente", "alert-success", req, res);
    } catch (e) {
        if (e.errors.name) {
            id++;
            json.push({ "mensaje": e.errors.name.message, "id": id });
        }
        if (e.errors.email) {
            id++;
            json.push({ "mensaje": e.errors.email.message, "id": id });
        }
        if (e.errors.type) {
            id++;
            json.push({ "mensaje": "Tipo de zombie no valido", "id": id });
        }
        res.status(500).json({ mensajeError: json, mensajeExito:''});
    }
});

//Eliminar

router.delete('/zombies/delete/:id', async function(req, res) {
    try {
        var zombie = await Zombie.findById(req.params.id);
        zombie.remove();
        listadoZombies("Zombie eliminado correctamente", "alert-success", req, res);

    } catch (e) {
        res.status(500).json({ mensajeError: e, mensajeExito:''});
    }
});

function listadoZombies(_alert, _color, req, res) {
    Zombie.find().exec(function(error, Zombies) {
        if (!error) {
            console.log(Zombies);
            res.status(200).json({mensajeError:'', mensajeExito: _alert});
        }
    });
}

//Lista Cerebros
router.get('/cerebros', async(req,res) => {
    console.log(req.query.p);
    if(req.query.q === 'Administrador'){
        Cerebro.find().exec((error,cerebros) => {
                if(!error)
                {
                    res.status(200).json(cerebros);
                }
                else
                {
                    res.status(500).json(error);
                }
            });
    }else{
            Cerebro.find().where('usuarioId').equals(req.query.p).exec((error,cerebros) => {
                if(!error)
                {
                    res.status(200).json(cerebros);
                }
                else
                {
                    res.status(500).json(error);
                }
            });
    }
  
});

//  obtenerUsuariosConCerebros
router.post('/graficaUsuario', function(req,res){
        Cerebro.distinct('usuarioId').exec(function (error, usuarios) {
            if(!error){
                  console.log('The number of unique users is: %d', usuarios.length);
                  res.json(usuarios);
            }else{
                console.log('el error es: '+ error)
                  res.json(error);
            }
        });
});

//cuentaPorUsuario
router.post('/cuentaPorUsuario', function(req,res){
    Cerebro.find().where('usuarioId').equals(req.body._id).exec((error,cerebros) => {
        if(!error)
        {
            res.json(cerebros);
        }
        else
        {
            res.json(error);
        }
    });
}); 

//traer nombre de ususario para gráfica 
router.post('/traeUsuario', function(req, res){
    console.log(req.body._id);
    Usuario.findOne({'_id' : req.body._id}).exec(function(error, _usuario) {
            if(!error){
                  console.log(_usuario.username);
                  res.json(_usuario.username);
            }else{
                console.log('el error es: '+ error)
                  res.json(error);
            }
    });
});

//  obtenerSaboresCerebros
router.post('/graficaCerebro', function(req,res){
        Cerebro.distinct('flavor').exec(function (error, sabores) {
            if(!error){
                  console.log('The number of unique users is: %d', sabores.length);
                  res.json(sabores);
            }else{
                console.log('el error es: '+ error)
                  res.json(error);
            }
        });
});

//cuentaCerebro
router.post('/cuentaCerebro', function(req,res){
        Cerebro.find().where('flavor').equals(req.body.sabor).exec((error,cerebros) => {
        if(!error)
        {
            res.json(cerebros);
        }
        else
        {
            res.json(error);
        }
    });
}); 

//Nuevo cerebro 
router.post('/cerebros/new', function(req, res) {
    var cerebro = req;
    var data = req.body;
    var newCerebro = new Cerebro({
        flavor: data.flavor,
        description: data.description,
        iq: data.iq,
        picture: data.picture,
        usuarioId: data.usuarioId
    });
    var json = [];
    var id = 0;
    if (newCerebro.flavor == "" || newCerebro.description == "" || newCerebro.flavor == undefined || newCerebro.description == undefined
          || newCerebro.usuarioId == undefined || newCerebro.usuarioId == "") {
        id++;
        json.push({ "mensaje": "Los datos están incompletos", "id": id });
        res.render('cerebro/add', { alert: json, color: "alert-danger" })

    } else {
        newCerebro.save(function(error) {
            if (error) {

                if (error.errors.flavor) {
                    id++;
                    json.push({ "mensaje": error.errors.flavor.message, "id": id });
                }
                if (error.errors.description) {
                    id++;
                    json.push({ "mensaje": error.errors.description.message, "id": id });
                }
                if (error.errors.iq) {
                    id++;
                    json.push({ "mensaje": error.errors.iq.message, "id": id });
                }
                if (error.errors.picture) {
                    id++;
                    json.push({ "mensaje": "Imagen no seleccionada", "id": id });
                }
                if (error.errors.usuarioId) {
                    id++;
                    json.push({ "mensaje": error.errors.usuarioId.message, "id": id });
                }
                res.status(500).json({ mensajeError: json });
            } else {
                listadoCerebros("El Cerebro se ha insertado correctamente", "alert-success", req, res);
            }
        });
    }
});

//Editar

router.put('/cerebros/edit/:id', async function(req, res) {
    var json = [];
    var id = 0;
    try {
        var cerebro = await Cerebro.findById(req.params.id);
        cerebro.flavor = req.body.flavor;
        cerebro.description = req.body.description;
        cerebro.iq = req.body.iq;
        cerebro.picture = req.body.picture;
        await cerebro.save();
        listadoCerebros("Cerebro editado correctamente", "alert-success", req, res);
    } catch (e) {
        if (e.errors.flavor) {
            id++;
            json.push({ "mensaje": e.errors.flavor.message, "id": id });
        }
        if (e.errors.description) {
            id++;
            json.push({ "mensaje": e.errors.description.message, "id": id });
        }
        if (e.errors.iq) {
            id++;
            json.push({ "mensaje": e.errors.iq.message, "id": id });
        }
        if (e.errors.picture) {
            id++;
            json.push({ "mensaje": "Imagen no seleccionada", "id": id });
        }
        res.status(500).json({ mensajeError: json });
    }
});

//Eliminar

router.delete('/cerebros/delete/:id', async function(req, res) {
    try {
        var cerebro = await Cerebro.findById(req.params.id);
        cerebro.delete();
        listadoCerebros("Cerebro eliminado correctamente", "alert-success", req, res);
    } catch (e) {
        res.status(500).json({ mensajeError: e, mensajeExito:''});
    }
});

function listadoCerebros(_alert, _color, req, res) {
    Cerebro.find().exec(function(error, Cerebros) {
        if (!error) {
            console.log(Cerebros);
            res.status(200).json({mensajeError:'', mensajeExito: _alert});
        }
    });
}

//Usuarios

//Login

router.post('/users/login', function(req, res) {
    var data = req.body;
    var usuario = new Usuario({
        username: data.username,
        password: data.password
    });
    
    console.log(usuario.username);
    console.log(usuario.password);
    Usuario.findOne({username:usuario.username}).exec(function(error, _usuario) {
        if (!error) {
            console.log(_usuario);
            if (_usuario == null)
            {
                indexLogin("Usuario incorrecto", "alert-danger", req, res);
            }
            else
            {
                bcrypt.compare(usuario.password, _usuario.password, function(error, result) {
                    if(result){
                      res.status(200).json({mensajeError:'', mensajeExito: 'success', usuarioId: _usuario._id, tipoUsuario: _usuario.tipo});
                    } else {
                      res.status(500).json({mensajeError:'Contraseña incorrecta', mensajeExito: ''});
                    }
                  });
            }
        }
        else
        {
            res.status(500).json({ mensajeError: error, mensajeExito:''});
        }
    });
});

//Register

router.post('/users/new', function(req, res) {
    var user = req;
    var data = req.body;
    bcrypt.hash(data.password, saltRounds, function (err,   hash) {
        var nuevoUser = new Usuario({
            username: data.username,
            password: hash,
            email: data.email,
            tipo: data.tipo
        });
        console.log(nuevoUser);
        var json = [];
        var id = 0;
        if (nuevoUser.username == undefined || nuevoUser.password == undefined || nuevoUser.username == "" || nuevoUser.password == ""
              || nuevoUser.tipo == undefined || nuevoUser.tipo == "") {
            id++;
            json.push({ "mensaje": "No has llenado todos los datos, intenta de nuevo.", "id": id });
            res.status(500).json({ mensajeError: json, mensajeExito:''});
    
        } else {
            nuevoUser.save(function(error) {
                if (error) {
    
                    if (error.errors.username) {
                        id++;
                        json.push({ "mensaje": error.errors.username.message, "id": id });
                    }
                    if (error.errors.password) {
                        id++;
                        json.push({ "mensaje": error.errors.password.message, "id": id });
                    }
                    if (error.errors.email) {
                        id++;
                        json.push({ "mensaje": error.errors.email.message, "id": id });
                    }
                    if (error.errors.tipo) {
                        id++;
                        json.push({ "mensaje": error.errors.tipo.message, "id": id });
                    }
                    res.status(500).json({ mensajeError: json, mensajeExito:''});
                } else {
                    res.status(200).json({ mensajeError: "", mensajeExito:'Usuario registrado correctamente'});
                }
            });
        }
    });
    
});

function indexLogin(_alert, _color, req, res) { 
    res.status(500).json({mensajeError:_alert, mensajeExito: ''});
}

module.exports = router;