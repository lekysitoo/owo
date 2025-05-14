/* VARIABLES */

/* ROOM */

const roomName = '🐐 𝐆𝐎𝐀𝐓 𝐋𝐄𝐕𝐄𝐋  🐐  🔵   BIG X3   🔵';
const maxPlayers = 16;
const roomPublic = true;
const token = ""; // Insert token here
const geo = { code: "ar", lat: -34.6374, lon: -58.4058 };


var roomWebhook = ''; // this webhook is used to send the details of the room (chat, join, leave) ; it should be in a private discord channel
var gameWebhook = ''; // this webhook is used to send the summary of the games ; it should be in a public discord channel
var fetchRecordingVariable = true;
var timeLimit = 3;
var scoreLimit = 3;

var gameConfig = {
    roomName: roomName,
    maxPlayers: maxPlayers,
    public: roomPublic,
    noPlayer: true,
	password: null,
    geo: geo
}

if (typeof token == 'string' && token.length == 39) {
    gameConfig.token = token;
}

var room = HBInit(gameConfig);


const trainingMap = '{"name":"AHA Classic (Training) v2.1","width":420,"height":200,"bg":{"type":"grass","width":370,"height":170,"kickOffRadius":75},"vertexes":[{"x":-370,"y":170,"cMask":["ball"]},{"x":-370,"y":64,"cMask":["ball"]},{"x":-370,"y":-64,"cMask":["ball"]},{"x":-370,"y":-170,"cMask":["ball"]},{"x":370,"y":170,"cMask":["ball"]},{"x":370,"y":64,"cMask":["ball"]},{"x":370,"y":-64,"cMask":["ball"]},{"x":370,"y":-170,"cMask":["ball"]},{"x":-380,"y":-64,"bCoef":3,"cMask":["ball"]},{"x":-400,"y":-44,"bCoef":3,"cMask":["ball"]},{"x":-400,"y":44,"bCoef":3,"cMask":["ball"]},{"x":-380,"y":64,"bCoef":3,"cMask":["ball"]},{"x":380,"y":-64,"bCoef":3,"cMask":["ball"]},{"x":400,"y":-44,"bCoef":3,"cMask":["ball"]},{"x":400,"y":44,"bCoef":3,"cMask":["ball"]},{"x":380,"y":64,"bCoef":3,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":4,"v1":5,"bias":40,"vis":false,"cMask":["ball"]},{"v0":6,"v1":7,"bias":40,"vis":false,"cMask":["ball"]},{"v0":9,"v1":8,"bCoef":3,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":9,"v1":10,"bCoef":3,"cMask":["ball"]},{"v0":11,"v1":10,"bCoef":3,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":12,"v1":13,"bCoef":3,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":13,"v1":14,"bCoef":3,"cMask":["ball"]},{"v0":14,"v1":15,"bCoef":3,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]}],"planes":[{"normal":[0,1],"dist":-170,"cMask":["ball"]},{"normal":[0,-1],"dist":-170,"cMask":["ball"]},{"normal":[0,1],"dist":-200,"bCoef":0.1},{"normal":[0,-1],"dist":-200,"bCoef":0.1},{"normal":[1,0],"dist":-420,"bCoef":0.1},{"normal":[-1,0],"dist":-420,"bCoef":0.1}],"goals":[],"discs":[{"radius":9.3,"bCoef":0.45,"invMass":1.12,"damping":0.9893,"cGroup":["ball","kick","score"]},{"pos":[-370,64],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[-370,-64],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[370,64],"radius":8,"invMass":0,"color":"CCCCFF"},{"pos":[370,-64],"radius":8,"invMass":0,"color":"CCCCFF"}],"playerPhysics":{},"ballPhysics":"disc0","spawnDistance":30}';
const classicMap = '{"name":"AHA Classic v2.1","width":420,"height":200,"bg":{"type":"grass","width":370,"height":170,"kickOffRadius":75},"vertexes":[{"x":-370,"y":170,"cMask":["ball"]},{"x":-370,"y":64,"cMask":["ball"]},{"x":-370,"y":-64,"cMask":["ball"]},{"x":-370,"y":-170,"cMask":["ball"]},{"x":370,"y":170,"cMask":["ball"]},{"x":370,"y":64,"cMask":["ball"]},{"x":370,"y":-64,"cMask":["ball"]},{"x":370,"y":-170,"cMask":["ball"]},{"x":0,"y":200,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":75,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-75,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-200,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-380,"y":-64,"bCoef":0.1,"cMask":["ball"]},{"x":-400,"y":-44,"bCoef":0.1,"cMask":["ball"]},{"x":-400,"y":44,"bCoef":0.1,"cMask":["ball"]},{"x":-380,"y":64,"bCoef":0.1,"cMask":["ball"]},{"x":380,"y":-64,"bCoef":0.1,"cMask":["ball"]},{"x":400,"y":-44,"bCoef":0.1,"cMask":["ball"]},{"x":400,"y":44,"bCoef":0.1,"cMask":["ball"]},{"x":380,"y":64,"bCoef":0.1,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":4,"v1":5,"bias":40,"vis":false,"cMask":["ball"]},{"v0":6,"v1":7,"bias":40,"vis":false,"cMask":["ball"]},{"v0":13,"v1":12,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":13,"v1":14,"bCoef":0.1,"cMask":["ball"]},{"v0":15,"v1":14,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":16,"v1":17,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":17,"v1":18,"bCoef":0.1,"cMask":["ball"]},{"v0":18,"v1":19,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":8,"v1":9,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":9,"v1":10,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":10,"v1":9,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"]},{"v0":10,"v1":11,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"planes":[{"normal":[0,1],"dist":-170,"cMask":["ball"]},{"normal":[0,-1],"dist":-170,"cMask":["ball"]},{"normal":[0,1],"dist":-200,"bCoef":0.1},{"normal":[0,-1],"dist":-200,"bCoef":0.1},{"normal":[1,0],"dist":-420,"bCoef":0.1},{"normal":[-1,0],"dist":-420,"bCoef":0.1}],"goals":[{"p0":[-370,64],"p1":[-370,-64],"team":"red"},{"p0":[370,64],"p1":[370,-64],"team":"blue"}],"discs":[{"radius":9.3,"bCoef":0.45,"invMass":1.12,"damping":0.9893,"cGroup":["ball","kick","score"]},{"pos":[-370,64],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[-370,-64],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[370,64],"radius":8,"invMass":0,"color":"CCCCFF"},{"pos":[370,-64],"radius":8,"invMass":0,"color":"CCCCFF"}],"playerPhysics":{},"ballPhysics":"disc0","spawnDistance":170}';
const bigMap = '{"name":"AHA Big v2.1","width":600,"height":270,"bg":{"type":"grass","width":550,"height":240,"kickOffRadius":80},"vertexes":[{"x":-550,"y":240,"cMask":["ball"]},{"x":-550,"y":80,"cMask":["ball"]},{"x":-550,"y":-80,"cMask":["ball"]},{"x":-550,"y":-240,"cMask":["ball"]},{"x":550,"y":240,"cMask":["ball"]},{"x":550,"y":80,"cMask":["ball"]},{"x":550,"y":-80,"cMask":["ball"]},{"x":550,"y":-240,"cMask":["ball"]},{"x":0,"y":270,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-270,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-560,"y":-80,"bCoef":0.1,"cMask":["ball"]},{"x":-580,"y":-60,"bCoef":0.1,"cMask":["ball"]},{"x":-580,"y":60,"bCoef":0.1,"cMask":["ball"]},{"x":-560,"y":80,"bCoef":0.1,"cMask":["ball"]},{"x":560,"y":-80,"bCoef":0.1,"cMask":["ball"]},{"x":580,"y":-60,"bCoef":0.1,"cMask":["ball"]},{"x":580,"y":60,"bCoef":0.1,"cMask":["ball"]},{"x":560,"y":80,"bCoef":0.1,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"bias":-40,"vis":false,"cMask":["ball"]},{"v0":4,"v1":5,"bias":40,"vis":false,"cMask":["ball"]},{"v0":6,"v1":7,"bias":40,"vis":false,"cMask":["ball"]},{"v0":13,"v1":12,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":13,"v1":14,"bCoef":0.1,"cMask":["ball"]},{"v0":15,"v1":14,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":16,"v1":17,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":17,"v1":18,"bCoef":0.1,"cMask":["ball"]},{"v0":18,"v1":19,"bCoef":0.1,"curve":89.99999999999999,"curveF":1.0000000000000002,"cMask":["ball"]},{"v0":8,"v1":9,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":9,"v1":10,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":10,"v1":9,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"]},{"v0":10,"v1":11,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]}],"planes":[{"normal":[0,1],"dist":-240,"cMask":["ball"]},{"normal":[0,-1],"dist":-240,"cMask":["ball"]},{"normal":[0,1],"dist":-270,"bCoef":0.1},{"normal":[0,-1],"dist":-270,"bCoef":0.1},{"normal":[1,0],"dist":-600,"bCoef":0.1},{"normal":[-1,0],"dist":-600,"bCoef":0.1}],"goals":[{"p0":[-550,80],"p1":[-550,-80],"team":"red"},{"p0":[550,80],"p1":[550,-80],"team":"blue"}],"discs":[{"radius":9.3,"bCoef":0.45,"invMass":1.12,"damping":0.9893,"cGroup":["ball","kick","score"]},{"pos":[-550,80],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[-550,-80],"radius":8,"invMass":0,"color":"FFCCCC"},{"pos":[550,80],"radius":8,"invMass":0,"color":"CCCCFF"},{"pos":[550,-80],"radius":8,"invMass":0,"color":"CCCCFF"}],"playerPhysics":{},"ballPhysics":"disc0","spawnDistance":350}';


var trainingMapObj = JSON.parse(trainingMap);
var classicMapObj = JSON.parse(classicMap);
var bigMapObj = JSON.parse(bigMap);





room.setScoreLimit(scoreLimit);
room.setTimeLimit(timeLimit);
room.setTeamsLock(true);
room.setKickRateLimit(6, 0, 0);

var masterPassword = 10000 + getRandomInt(90000);
var roomPassword = '';

/* OPTIONS */

// Al inicio de tu código
var statsDatabase = {};
var statsVariable = {};

// Cargar datos si es posible
try {
    const savedStats = localStorage.getItem('statsDatabase');
    if (savedStats) {
        statsDatabase = JSON.parse(savedStats);
    }
} catch (e) {
    console.log("Error al cargar estadísticas:", e);
}


// Variables globales (agregar al inicio del archivo)
var pausaSolicitada = false;
var jugadorSolicitante = null;
var pausaActiva = false;

var reinicioSolicitado = false;
var jugadorSolicitanteReinicio = null;
var equipoSolicitanteReinicio = null;
var confirmacionesReinicio = [];

var avatarIntervals = {};
var playerAvatarCooldowns = {};
const AVATAR_COOLDOWN = 60000; // 1 minuto de cooldown
let currentStadium = ""; // Guardar el nombre del estadio actual


var ArqueroRED = null;
var ArqueroBLUE = null;

// Función para actualizar los arqueros
function updateGK() {
    var players = room.getPlayerList();
    ArqueroRED = null;
    ArqueroBLUE = null;
    
    for (var i = 0; i < players.length; i++) {
        if (players[i].position != null) {
            if (players[i].team == Team.RED && players[i].position.x < -370) {
                ArqueroRED = players[i];
            } else if (players[i].team == Team.BLUE && players[i].position.x > 370) {
                ArqueroBLUE = players[i];
            }
        }
    }
}

/* SISTEMA DE ASIGNACIÓN AUTOMÁTICA */


var drawTimeLimit = Infinity;
var teamSize = 3;
var maxAdmins = 0;
var disableBans = false;
var debugMode = false;
var afkLimit = debugMode ? Infinity : 15;

var defaultSlowMode = 0.5;
var chooseModeSlowMode = 1;
var slowMode = defaultSlowMode;
var SMSet = new Set();

var hideClaimMessage = true;
var mentionPlayersUnpause = true;
// Añade esto con tus otras variables globales
   // Al inicio de tu script
   var playerStats = {}; // Una única variable para estadísticas
   
   // Luego reemplaza todas las referencias a statsDatabase y statsVariable
   // con playerStats

// Si tienes localStorage, intenta cargar desde allí
try {
    const storedStats = localStorage.getItem('statsDatabase');
    if (storedStats) {
        statsDatabase = JSON.parse(storedStats);
    }
} catch (e) {
    console.log("No se pudo cargar estadísticas desde localStorage");
}

// Funciones del sistema de camisetas (disponibles globalmente)
var camisetasEquipos = {
        // RIVER PLATE
        "riv/titular/red": {
            codigo: "/colors red 30 231F20 FFFFFF EE1B2C FFFFFF",
            nombreEquipo: "RIVER PLATE"
        },
        "riv/titular/blue": {
            codigo: "/colors blue 30 231F20 FFFFFF DA291C FFFFFF",
            nombreEquipo: "RIVER PLATE"
        },
        "riv/alternativa/red": {
            codigo: "/colors red 64 FFFFFF F0232F 312B31 281F22",
            nombreEquipo: "RIVER PLATE"
        },
        "riv/alternativa/blue": {
            codigo: "/colors blue 64 FFFFFF F0232F 312B31 281F22",
            nombreEquipo: "RIVER PLATE"
        },
        "riv/tercera/red": {
            codigo: "/colors red 180 271D1C F71E26 F0F1F5 F71E26",
            nombreEquipo: "RIVER PLATE"
        },
        "riv/tercera/blue": {
            codigo: "/colors blue 180 271D1C F71E26 F0F1F5 F71E26",
            nombreEquipo: "RIVER PLATE"
        },
    
        // BOCA JUNIORS
        "boc/titular/red": {
            codigo: "/colors red 90 FFFFFF 033F86 FAB900 033F86",
            nombreEquipo: "BOCA JUNIORS"
        },
        "boc/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 033F86 FAB900 033F86",
            nombreEquipo: "BOCA JUNIORS"
        },
        "boc/alternativa/red": {
            codigo: "/colors red 134 00448B C9C5D3 D4CEDA D4CEDA",
            nombreEquipo: "BOCA JUNIORS"
        },
        "boc/alternativa/blue": {
            codigo: "/colors blue 134 00448B C9C5D3 D4CEDA D4CEDA",
            nombreEquipo: "BOCA JUNIORS"
        },
        "boc/tercera/red": {
            codigo: "/colors red 118 142090 EBE12F",
            nombreEquipo: "BOCA JUNIORS"
        },
        "boc/tercera/blue": {
            codigo: "/colors blue 118 142090 EBE12F",
            nombreEquipo: "BOCA JUNIORS"
        },
    
        // SAN LORENZO
        "slo/titular/red": {
            codigo: "/colors red 180 FFFFFF E9282D 1D3B56 E9282D",
            nombreEquipo: "SAN LORENZO"
        },
        "slo/titular/blue": {
            codigo: "/colors blue 180 FFFFFF E9282D 1D3B56 E9282D",
            nombreEquipo: "SAN LORENZO"
        },
        "slo/alternativa/red": {
            codigo: "/colors red 90 1E2631 F2F3F7 EB212F 1B3146",
            nombreEquipo: "SAN LORENZO"
        },
        "slo/alternativa/blue": {
            codigo: "/colors blue 90 1E2631 F2F3F7 EB212F 1B3146",
            nombreEquipo: "SAN LORENZO"
        },
        "slo/tercera/red": {
            codigo: "/colors red 0 172025 BAC3C8 BAC3C8 D50013",
            nombreEquipo: "SAN LORENZO"
        },
        "slo/tercera/blue": {
            codigo: "/colors blue 0 172025 BAC3C8 BAC3C8 D50013",
            nombreEquipo: "SAN LORENZO"
        },
    
        // RACING CLUB
        "rac/titular/red": {
            codigo: "/colors red 180 002942 00A5E3 FFFFFF 00A5E3",
            nombreEquipo: "RACING CLUB"
        },
        "rac/titular/blue": {
            codigo: "/colors blue 180 002942 00A5E3 FFFFFF 00A5E3",
            nombreEquipo: "RACING CLUB"
        },
        "rac/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 0E273B 1DA3DD 0E273B",
            nombreEquipo: "RACING CLUB"
        },
        "rac/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 0E273B 1DA3DD 0E273B",
            nombreEquipo: "RACING CLUB"
        },
        "rac/tercera/red": {
            codigo: "/colors red 66 FFFFFF 019BDB 0F2A3D 0F2A3D",
            nombreEquipo: "RACING CLUB"
        },
        "rac/tercera/blue": {
            codigo: "/colors blue 66 FFFFFF 019BDB 0F2A3D 0F2A3D",
            nombreEquipo: "RACING CLUB"
        },
    
        // INDEPENDIENTE
        "ind/titular/red": {
            codigo: "/colors red 60 FFFFFF EC1C24",
            nombreEquipo: "INDEPENDIENTE"
        },
        "ind/titular/blue": {
            codigo: "/colors blue 60 FFFFFF EC1C24",
            nombreEquipo: "INDEPENDIENTE"
        },
        "ind/alternativa/red": {
            codigo: "/colors red 90 1D245C 002554 FFFFFF FFFFFF",
            nombreEquipo: "INDEPENDIENTE"
        },
        "ind/alternativa/blue": {
            codigo: "/colors blue 90 1D245C 002554 FFFFFF FFFFFF",
            nombreEquipo: "INDEPENDIENTE"
        },
        // ALDOSIVI
        "ald/titular/red": {
            codigo: "/colors red 180 F5CF00 3E984C F5CF00",
            nombreEquipo: "ALDOSIVI"
        },
        "ald/titular/blue": {
            codigo: "/colors blue 180 F5CF00 3E984C F5CF00",
            nombreEquipo: "ALDOSIVI"
        },
        "ald/alternativa/red": {
            codigo: "/colors red 90 F8F232 B7BBC6 AAAEB7",
            nombreEquipo: "ALDOSIVI"
        },
        "ald/alternativa/blue": {
            codigo: "/colors blue 90 F8F232 B7BBC6 AAAEB7",
            nombreEquipo: "ALDOSIVI"
        },
        "ald/titular/red/2020": {
            codigo: "/colors red 180 F8F232 0E9E59 F8F232",
            nombreEquipo: "ALDOSIVI"
        },
        "ald/titular/blue/2020": {
            codigo: "/colors blue 180 F8F232 0E9E59 F8F232",
            nombreEquipo: "ALDOSIVI"
        },
    
        // GIMNASIA (LP)
        "gim/titular/red": {
            codigo: "/colors red 90 00AFEF 12175E FFFFFF",
            nombreEquipo: "GIMNASIA (LP)"
        },
        "gim/titular/blue": {
            codigo: "/colors blue 90 00AFEF 12175E FFFFFF",
            nombreEquipo: "GIMNASIA (LP)"
        },
        "gim/alternativa/red": {
            codigo: "/colors red 90 1A264F 022C94",
            nombreEquipo: "GIMNASIA (LP)"
        },
        "gim/alternativa/blue": {
            codigo: "/colors blue 90 1A264F 022C94",
            nombreEquipo: "GIMNASIA (LP)"
        },
        "gim/tercera/red": {
            codigo: "/colors red 90 4B4D3F 221F3A 4B4D3F",
            nombreEquipo: "GIMNASIA (LP)"
        },
        "gim/tercera/blue": {
            codigo: "/colors blue 90 4B4D3F 221F3A 4B4D3F",
            nombreEquipo: "GIMNASIA (LP)"
        },
        "gim/alternativa/clasica/red": {
            codigo: "/colors red 90 202743 FFFFFF 202743",
            nombreEquipo: "GIMNASIA"
        },
        "gim/alternativa/clasica/blue": {
            codigo: "/colors blue 90 202743 FFFFFF 202743",
            nombreEquipo: "GIMNASIA"
        },
    
        // NEWELL'S OLD BOYS
        "nob/titular/red": {
            codigo: "/colors red 0 EE1D23 000000",
            nombreEquipo: "NEWELLS"
        },
        "nob/titular/blue": {
            codigo: "/colors blue 0 EE1D23 000000",
            nombreEquipo: "NEWELLS"
        },
        "nob/alternativa/red": {
            codigo: "/colors red 90 D30022 222222 F3F7FA",
            nombreEquipo: "NEWELLS"
        },
        "nob/alternativa/blue": {
            codigo: "/colors blue 90 D30022 222222 F3F7FA",
            nombreEquipo: "NEWELLS"
        },
        "nob/tercera/red": {
            codigo: "/colors red 90 191919 D41831 D41831",
            nombreEquipo: "NEWELLS"
        },
        "nob/tercera/blue": {
            codigo: "/colors blue 90 191919 D41831 D41831",
            nombreEquipo: "NEWELLS"
        },
    
        // ROSARIO CENTRAL
        "cen/titular/red": {
            codigo: "/colors red 180 FCD828 144178 FCD828",
            nombreEquipo: "ROSARIO CENTRAL"
        },
        "cen/titular/blue": {
            codigo: "/colors blue 180 FCD828 144178 FCD828",
            nombreEquipo: "ROSARIO CENTRAL"
        },
        "cen/alternativa/red": {
            codigo: "/colors red 180 EBC800 FFFFFF EBC800",
            nombreEquipo: "ROSARIO CENTRAL"
        },
        "cen/alternativa/blue": {
            codigo: "/colors blue 180 EBC800 FFFFFF EBC800",
            nombreEquipo: "ROSARIO CENTRAL"
        },
        "cen/tercera/red": {
            codigo: "/colors red 121 006B8C 0386CE 02B1DC",
            nombreEquipo: "ROSARIO CENTRAL"
        },
        "cen/tercera/blue": {
            codigo: "/colors blue 121 006B8C 0386CE 02B1DC",
            nombreEquipo: "ROSARIO CENTRAL"
        },
    
        // DEFENSA Y JUSTICIA
        "dyj/titular/red": {
            codigo: "/colors red 90 019B5F FDE101 FDE101",
            nombreEquipo: "DEFENSA Y JUSTICIA"
        },
        "dyj/titular/blue": {
            codigo: "/colors blue 90 019B5F FDE101 FDE101",
            nombreEquipo: "DEFENSA Y JUSTICIA"
        },
        "dyj/alternativa/red": {
            codigo: "/colors red 65 AEE264 FFFFFF AEE264",
            nombreEquipo: "DEFENSA Y JUSTICIA"
        },
        "dyj/alternativa/blue": {
            codigo: "/colors blue 65 AEE264 FFFFFF AEE264",
            nombreEquipo: "DEFENSA Y JUSTICIA"
        },
        "dyj/clasica/red": {
            codigo: "/colors red 65 007A3F FFDD00 007A3F",
            nombreEquipo: "DEFENSA Y JUSTICIA"
        },
        "dyj/clasica/blue": {
            codigo: "/colors blue 65 007A3F FFDD00 007A3F",
            nombreEquipo: "DEFENSA Y JUSTICIA"
        },
    
        // ATLÉTICO MADRID
        "atm/titular/red": {
            codigo: "/colors red 180 292a6d e3221d FFFFFF e3221d",
            nombreEquipo: "ATLÉTICO MADRID"
        },
        "atm/titular/blue": {
            codigo: "/colors blue 180 292a6d e3221d FFFFFF e3221d",
            nombreEquipo: "ATLÉTICO MADRID"
        },
        "atm/alternativa/red": {
            codigo: "/colors red 180 201F24 E61711",
            nombreEquipo: "ATLÉTICO MADRID"
        },
        "atm/alternativa/blue": {
            codigo: "/colors blue 180 201F24 E61711",
            nombreEquipo: "ATLÉTICO MADRID"
        },
        "atm/tercera/red": {
            codigo: "/colors red 152 AFD4EB A6CFE8",
            nombreEquipo: "ATLÉTICO MADRID"
        },
        "atm/tercera/blue": {
            codigo: "/colors blue 152 AFD4EB A6CFE8",
            nombreEquipo: "ATLÉTICO MADRID"
        },
        // SEVILLA FC
        "sev/titular/red": {
            codigo: "/colors red 90 FE0000 D1D1D1 FFFFFF FFFFFF",
            nombreEquipo: "SEVILLA FC"
        },
        "sev/titular/blue": {
            codigo: "/colors blue 90 FE0000 D1D1D1 FFFFFF FFFFFF",
            nombreEquipo: "SEVILLA FC"
        },
    
        // BARCELONA FC
        "bar/titular/red": {
            codigo: "/colors red 180 F5B606 011EDE C80056",
            nombreEquipo: "BARCELONA FC"
        },
        "bar/titular/blue": {
            codigo: "/colors blue 180 F5B606 011EDE C80056",
            nombreEquipo: "BARCELONA FC"
        },
        "bar/alternativa/red": {
            codigo: "/colors red 60 263A7B C7C7F9",
            nombreEquipo: "BARCELONA FC"
        },
        "bar/alternativa/blue": {
            codigo: "/colors blue 60 263A7B C7C7F9",
            nombreEquipo: "BARCELONA FC"
        },
        "bar/tercera/red": {
            codigo: "/colors red 140 2B2E3F FAEA35 E32527 FAEA35",
            nombreEquipo: "BARCELONA FC"
        },
        "bar/tercera/blue": {
            codigo: "/colors blue 140 2B2E3F FAEA35 E32527 FAEA35",
            nombreEquipo: "BARCELONA FC"
        },
    
        // REAL MADRID
        "rma/titular/red": {
            codigo: "/colors red 73 0f2145 ffc10a FFFFFF FFFFFF",
            nombreEquipo: "REAL MADRID"
        },
        "rma/titular/blue": {
            codigo: "/colors blue 73 0f2145 ffc10a FFFFFF FFFFFF",
            nombreEquipo: "REAL MADRID"
        },
        "rma/alternativa/red": {
            codigo: "/colors red 67 FFC94B 474E64 323D52 212B3A",
            nombreEquipo: "REAL MADRID"
        },
        "rma/alternativa/blue": {
            codigo: "/colors blue 67 FFC94B 474E64 323D52 212B3A",
            nombreEquipo: "REAL MADRID"
        },
        "rma/tercera/red": {
            codigo: "/colors red 180 002957 6EE2C8",
            nombreEquipo: "REAL MADRID"
        },
        "rma/tercera/blue": {
            codigo: "/colors blue 180 002957 6EE2C8",
            nombreEquipo: "REAL MADRID"
        },
    
        // INTER MILAN
        "int/titular/red": {
            codigo: "/colors red 180 FFFFFF 00239C 000000 00239C",
            nombreEquipo: "INTER MILAN"
        },
        "int/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 00239C 000000 00239C",
            nombreEquipo: "INTER MILAN"
        },
        "int/alternativa/red": {
            codigo: "/colors red 180 0157D2 FFFFFF",
            nombreEquipo: "INTER MILAN"
        },
        "int/alternativa/blue": {
            codigo: "/colors blue 180 0157D2 FFFFFF",
            nombreEquipo: "INTER MILAN"
        },
        "int/tercera/red": {
            codigo: "/colors red 180 48E4FA 0D1313",
            nombreEquipo: "INTER MILAN"
        },
        "int/tercera/blue": {
            codigo: "/colors blue 180 48E4FA 0D1313",
            nombreEquipo: "INTER MILAN"
        },
    
        // AC MILAN
        "acm/titular/red": {
            codigo: "/colors red 180 FFFFFF DF061B 000000 DF061B",
            nombreEquipo: "AC MILAN"
        },
        "acm/titular/blue": {
            codigo: "/colors blue 180 FFFFFF DF061B 000000 DF061B",
            nombreEquipo: "AC MILAN"
        },
        "acm/alternativa/red": {
            codigo: "/colors red 180 A61726 FAFAFA",
            nombreEquipo: "AC MILAN"
        },
        "acm/alternativa/blue": {
            codigo: "/colors blue 180 A61726 FAFAFA",
            nombreEquipo: "AC MILAN"
        },
        "acm/tercera/red": {
            codigo: "/colors red 180 F9F9F9 2A2A2A",
            nombreEquipo: "AC MILAN"
        },
        "acm/tercera/blue": {
            codigo: "/colors blue 180 F9F9F9 2A2A2A",
            nombreEquipo: "AC MILAN"
        },
    
        // CRUZEIRO
        "cru/titular/red": {
            codigo: "/colors red 180 E3E7F0 0146AB 044BB3 0146AB",
            nombreEquipo: "CRUZEIRO"
        },
        "cru/titular/blue": {
            codigo: "/colors blue 180 E3E7F0 0146AB 044BB3 0146AB",
            nombreEquipo: "CRUZEIRO"
        },
        "cru/alternativa/red": {
            codigo: "/colors red 60 045AB1 EEF1F6",
            nombreEquipo: "CRUZEIRO"
        },
        "cru/alternativa/blue": {
            codigo: "/colors blue 60 045AB1 EEF1F6",
            nombreEquipo: "CRUZEIRO"
        },
        // PALMEIRAS
        "pal/titular/red": {
            codigo: "/colors red 90 FFFFFF 006337 00713D 00713D",
            nombreEquipo: "PALMEIRAS"
        },
        "pal/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 006337 00713D 00713D",
            nombreEquipo: "PALMEIRAS"
        },
        "pal/alternativa/red": {
            codigo: "/colors red 60 10372A F2F1F2",
            nombreEquipo: "PALMEIRAS"
        },
        "pal/alternativa/blue": {
            codigo: "/colors blue 60 10372A F2F1F2",
            nombreEquipo: "PALMEIRAS"
        },
        "pal/tercera/red": {
            codigo: "/colors red 60 FFFFFF 5ADAC5",
            nombreEquipo: "PALMEIRAS"
        },
        "pal/tercera/blue": {
            codigo: "/colors blue 60 FFFFFF 5ADAC5",
            nombreEquipo: "PALMEIRAS"
        },
    
        // GREMIO
        "gre/titular/red": {
            codigo: "/colors red 180 FFFFFF 009EE2 05171D 009EE2",
            nombreEquipo: "GREMIO"
        },
        "gre/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 009EE2 05171D 009EE2",
            nombreEquipo: "GREMIO"
        },
        "gre/alternativa/red": {
            codigo: "/colors red 180 0088BE FAFAFC",
            nombreEquipo: "GREMIO"
        },
        "gre/alternativa/blue": {
            codigo: "/colors blue 180 0088BE FAFAFC",
            nombreEquipo: "GREMIO"
        },
        "gre/titular/red/2019": {
            codigo: "/colors red 180 FFFFFF 0099DB 20181E 0099DB",
            nombreEquipo: "GREMIO"
        },
        "gre/titular/blue/2019": {
            codigo: "/colors blue 180 FFFFFF 19A2FF 20181E 19A2FF",
            nombreEquipo: "GREMIO"
        },
        "gre/clasica/red": {
            codigo: "/colors red 180 EEEDE8 03A2C9 22191C 03A2C9",
            nombreEquipo: "GREMIO"
        },
        "gre/clasica/blue": {
            codigo: "/colors blue 180 EEEDE8 03A2C9 22191C 03A2C9",
            nombreEquipo: "GREMIO"
        },
    
        // TOTTENHAM
        "tot/titular/red": {
            codigo: "/colors red 90 1F2652 FFFFFF",
            nombreEquipo: "TOTTENHAM"
        },
        "tot/titular/blue": {
            codigo: "/colors blue 90 1F2652 FFFFFF",
            nombreEquipo: "TOTTENHAM"
        },
        "tot/alternativa/red": {
            codigo: "/colors red 90 FFFEFF 1B294B 1B294B 232956",
            nombreEquipo: "TOTTENHAM"
        },
        "tot/alternativa/blue": {
            codigo: "/colors blue 90 FFFEFF 1B294B 1B294B 232956",
            nombreEquipo: "TOTTENHAM"
        },
        "tot/tercera/red": {
            codigo: "/colors red 90 161D4F 3AC0EB 36B4E3",
            nombreEquipo: "TOTTENHAM"
        },
        "tot/tercera/blue": {
            codigo: "/colors blue 90 161D4F 3AC0EB 36B4E3",
            nombreEquipo: "TOTTENHAM"
        },
        "tot/titular/red/2018": {
            codigo: "/colors red 90 171C4F F5F4F9 F5F4F9 182341",
            nombreEquipo: "TOTTENHAM"
        },
        "tot/titular/blue/2018": {
            codigo: "/colors blue 90 171C4F F5F4F9 F5F4F9 182341",
            nombreEquipo: "TOTTENHAM"
        },
        "tot/alternativa/red/2018": {
            codigo: "/colors red 90 FFFFFF 20374C 0EAF9B",
            nombreEquipo: "TOTTENHAM"
        },
        "tot/alternativa/blue/2018": {
            codigo: "/colors blue 90 FFFFFF 20374C 0EAF9B",
            nombreEquipo: "TOTTENHAM"
        },
    
        // LIVERPOOL
        "liv/titular/red": {
            codigo: "/colors red 180 F0F0F2 C4021D",
            nombreEquipo: "LIVERPOOL"
        },
        "liv/titular/blue": {
            codigo: "/colors blue 180 F0F0F2 C4021D",
            nombreEquipo: "LIVERPOOL"
        },
        "liv/alternativa/red": {
            codigo: "/colors red 180 000000 EBE8D0",
            nombreEquipo: "LIVERPOOL"
        },
        "liv/alternativa/blue": {
            codigo: "/colors blue 180 000000 EBE8D0",
            nombreEquipo: "LIVERPOOL"
        },
        "liv/tercera/red": {
            codigo: "/colors red 180 FF451D FCFE1E",
            nombreEquipo: "LIVERPOOL"
        },
        "liv/tercera/blue": {
            codigo: "/colors blue 180 FF451D FCFE1E",
            nombreEquipo: "LIVERPOOL"
        },
    
        // ARGENTINA
        "arg/titular/red": {
            codigo: "/colors red 180 1e2930 98cef0 ffffff 98cef0",
            nombreEquipo: "ARGENTINA"
        },
        "arg/titular/blue": {
            codigo: "/colors blue 180 1e2930 98cef0 ffffff 98cef0",
            nombreEquipo: "ARGENTINA"
        },
        "arg/alternativa/red": {
            codigo: "/colors red 90 CED3D9 0B245F 214196 7E6FB8",
            nombreEquipo: "ARGENTINA"
        },
        "arg/alternativa/blue": {
            codigo: "/colors blue 90 CED3D9 0B245F 214196 7E6FB8",
            nombreEquipo: "ARGENTINA"
        },
        "arg/bandera/red": {
            codigo: "/colors red 90 F6B40E 74ACDF FFFFFF 74ACDF",
            nombreEquipo: "ARGENTINA"
        },
        "arg/bandera/blue": {
            codigo: "/colors blue 90 F6B40E 74ACDF FFFFFF 74ACDF",
            nombreEquipo: "ARGENTINA"
        },
    
        // BÉLGICA
        "belg/titular/red": {
            codigo: "/colors red 44 F1E73A DC0121 391517 DC0121",
            nombreEquipo: "BÉLGICA"
        },
        "belg/titular/blue": {
            codigo: "/colors blue 44 F1E73A DC0121 391517 DC0121",
            nombreEquipo: "BÉLGICA"
        },
        "belg/alternativa/red": {
            codigo: "/colors red 90 000000 F9C700 F4AC00",
            nombreEquipo: "BÉLGICA"
        },
        "belg/alternativa/blue": {
            codigo: "/colors blue 90 000000 F9C700 F4AC00",
            nombreEquipo: "BÉLGICA"
        },
        "belg/bandera/red": {
            codigo: "/colors red 180 FFFFFF 000000 FAE042 ED2939",
            nombreEquipo: "BÉLGICA"
        },
        "belg/bandera/blue": {
            codigo: "/colors blue 180 FFFFFF 000000 FAE042 ED2939",
            nombreEquipo: "BÉLGICA"
        },
    
        // BRASIL
        "bra/titular/red": {
            codigo: "/colors red 180 00a032 ffcd00",
            nombreEquipo: "BRASIL"
        },
        "bra/titular/blue": {
            codigo: "/colors blue 180 00a032 ffcd00",
            nombreEquipo: "BRASIL"
        },
        "bra/alternativa/red": {
            codigo: "/colors red 90 F6D91F 1C4C90 0D60B1 0E72D6",
            nombreEquipo: "BRASIL"
        },
        "bra/alternativa/blue": {
            codigo: "/colors blue 90 F6D91F 1C4C90 0D60B1 0E72D6",
            nombreEquipo: "BRASIL"
        },
        "bra/tercera/red": {
            codigo: "/colors red 180 0053B5 F8F9FE",
            nombreEquipo: "BRASIL"
        },
        "bra/tercera/blue": {
            codigo: "/colors blue 180 0053B5 F8F9FE",
            nombreEquipo: "BRASIL"
        },
        // CHILE
        "chi/titular/red": {
            codigo: "/colors red 60 FFFFFF ED3422",
            nombreEquipo: "CHILE"
        },
        "chi/titular/blue": {
            codigo: "/colors blue 60 FFFFFF ED3422",
            nombreEquipo: "CHILE"
        },
    
        // URUGUAY
        "uru/titular/red": {
            codigo: "/colors red 90 2E3035 80BFE1 76B9DE",
            nombreEquipo: "URUGUAY"
        },
        "uru/titular/blue": {
            codigo: "/colors blue 90 2E3035 80BFE1 76B9DE",
            nombreEquipo: "URUGUAY"
        },
        "uru/alternativa/red": {
            codigo: "/colors red 75 373639 52ABDF F2F3F7 F2F3F7",
            nombreEquipo: "URUGUAY"
        },
        "uru/alternativa/blue": {
            codigo: "/colors blue 75 373639 52ABDF F2F3F7 F2F3F7",
            nombreEquipo: "URUGUAY"
        },
    
        // FRANCIA
        "fra/titular/red": {
            codigo: "/colors red 90 EABC78 1B2A4A",
            nombreEquipo: "FRANCIA"
        },
        "fra/titular/blue": {
            codigo: "/colors blue 90 EABC78 1B2A4A",
            nombreEquipo: "FRANCIA"
        },
        "fra/alternativa/red": {
            codigo: "/colors red 90 0977C5 FFFFFF E2EBF2",
            nombreEquipo: "FRANCIA"
        },
        "fra/alternativa/blue": {
            codigo: "/colors blue 90 0977C5 FFFFFF E2EBF2",
            nombreEquipo: "FRANCIA"
        },
        "fra/bandera/red": {
            codigo: "/colors red 1 939BA3 002395 FFFFFF ED2939",
            nombreEquipo: "FRANCIA"
        },
        "fra/bandera/blue": {
            codigo: "/colors blue 1 939BA3 002395 FFFFFF ED2939",
            nombreEquipo: "FRANCIA"
        },
    
        // CROACIA
        "cro/titular/red": {
            codigo: "/colors red 90 0065C9 D6001E F2F0F3 F2F0F3",
            nombreEquipo: "CROACIA"
        },
        "cro/titular/blue": {
            codigo: "/colors blue 90 0065C9 D6001E F2F0F3 F2F0F3",
            nombreEquipo: "CROACIA"
        },
        "cro/alternativa/red": {
            codigo: "/colors red 90 F6F6F8 E50738 0151C0 0151C0",
            nombreEquipo: "CROACIA"
        },
        "cro/alternativa/blue": {
            codigo: "/colors blue 90 F6F6F8 E50738 0151C0 0151C0",
            nombreEquipo: "CROACIA"
        },
        "cro/tercera/red": {
            codigo: "/colors red 90 E43840 272E30 4F5857",
            nombreEquipo: "CROACIA"
        },
        "cro/tercera/blue": {
            codigo: "/colors blue 90 E43840 272E30 4F5857",
            nombreEquipo: "CROACIA"
        },
    
        // NAPOLI
        "nap/titular/red": {
            codigo: "/colors red 180 FFFFFF 01B9EB",
            nombreEquipo: "NAPOLI"
        },
        "nap/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 01B9EB",
            nombreEquipo: "NAPOLI"
        },
        "nap/alternativa/red": {
            codigo: "/colors red 299 FFFFFF 7E8641 7E8641 33392E",
            nombreEquipo: "NAPOLI"
        },
        "nap/alternativa/blue": {
            codigo: "/colors blue 299 FFFFFF 7E8641 7E8641 33392E",
            nombreEquipo: "NAPOLI"
        },
    
        // BAYERN DE MUNICH
        "fcb/titular/red": {
            codigo: "/colors red 90 FFFFFF DC052D ED0038 ED0038",
            nombreEquipo: "BAYERN DE MUNICH"
        },
        "fcb/titular/blue": {
            codigo: "/colors blue 90 FFFFFF DC052D ED0038 ED0038",
            nombreEquipo: "BAYERN DE MUNICH"
        },
        "fcb/alternativa/red": {
            codigo: "/colors red 180 62676A F6F8FC",
            nombreEquipo: "BAYERN DE MUNICH"
        },
        "fcb/alternativa/blue": {
            codigo: "/colors blue 180 62676A F6F8FC",
            nombreEquipo: "BAYERN DE MUNICH"
        },
        "fcb/tercera/red": {
            codigo: "/colors red 180 E76352 132243",
            nombreEquipo: "BAYERN DE MUNICH"
        },
        "fcb/tercera/blue": {
            codigo: "/colors blue 180 E76352 132243",
            nombreEquipo: "BAYERN DE MUNICH"
        },
        // BORUSSIA DORTMUND
        "bvb/titular/red": {
            codigo: "/colors red 90 1d1d1b 1d1d1b fad515 fad515",
            nombreEquipo: "BORUSSIA DORTMUND"
        },
        "bvb/titular/blue": {
            codigo: "/colors blue 90 1d1d1b 1d1d1b fad515 fad515",
            nombreEquipo: "BORUSSIA DORTMUND"
        },
        "bvb/alternativa/red": {
            codigo: "/colors red 180 CECFD1 252525",
            nombreEquipo: "BORUSSIA DORTMUND"
        },
        "bvb/alternativa/blue": {
            codigo: "/colors blue 180 CECFD1 252525",
            nombreEquipo: "BORUSSIA DORTMUND"
        },
    
        // JUVENTUS
        "juv/titular/red": {
            codigo: "/colors red 180 F7C902 1F1A20 FFFFFF 1F1A20",
            nombreEquipo: "JUVENTUS"
        },
        "juv/titular/blue": {
            codigo: "/colors blue 180 F7C902 1F1A20 FFFFFF 1F1A20",
            nombreEquipo: "JUVENTUS"
        },
        "juv/alternativa/red": {
            codigo: "/colors red 126 FFFFFF FAA18D 25242A 25242A",
            nombreEquipo: "JUVENTUS"
        },
        "juv/alternativa/blue": {
            codigo: "/colors blue 126 FFFFFF FAA18D 25242A 25242A",
            nombreEquipo: "JUVENTUS"
        },
        "juv/tercera/red": {
            codigo: "/colors red 130 6370F2 FFFFFF F3E757 F3E757",
            nombreEquipo: "JUVENTUS"
        },
        "juv/tercera/blue": {
            codigo: "/colors blue 130 6370F2 FFFFFF F3E757 F3E757",
            nombreEquipo: "JUVENTUS"
        },
    
        // ESTUDIANTES (LP)
        "est/titular/red": {
            codigo: "/colors red 180 323232 E41815 FFFFFF E41815",
            nombreEquipo: "ESTUDIANTES (LP)"
        },
        "est/titular/blue": {
            codigo: "/colors blue 180 323232 E41815 FFFFFF E41815",
            nombreEquipo: "ESTUDIANTES (LP)"
        },
        "est/alternativa/red": {
            codigo: "/colors red 0 F51A22 FFFFFF FFFFFF F51A22",
            nombreEquipo: "ESTUDIANTES (LP)"
        },
        "est/alternativa/blue": {
            codigo: "/colors blue 0 F51A22 FFFFFF FFFFFF F51A22",
            nombreEquipo: "ESTUDIANTES (LP)"
        },
        "est/tercera/red": {
            codigo: "/colors red 90 FFFFFF 242424 D9201E D9201E",
            nombreEquipo: "ESTUDIANTES (LP)"
        },
        "est/tercera/blue": {
            codigo: "/colors blue 90 FFFFFF 242424 D9201E D9201E",
            nombreEquipo: "ESTUDIANTES (LP)"
        },
    
        // BANFIELD
        "band/titular/red": {
            codigo: "/colors red 180 B59859 007836 FFFFFF 007836",
            nombreEquipo: "BANFIELD"
        },
        "band/titular/blue": {
            codigo: "/colors blue 180 B59859 007836 FFFFFF 007836",
            nombreEquipo: "BANFIELD"
        },
        "band/alternativa/red": {
            codigo: "/colors red 44 FFFFFF 1C1C1C 09694A 1C1C1C",
            nombreEquipo: "BANFIELD"
        },
        "band/alternativa/blue": {
            codigo: "/colors blue 44 FFFFFF 1C1C1C 09694A 1C1C1C",
            nombreEquipo: "BANFIELD"
        },
        "band/clasica/red": {
            codigo: "/colors red 180 0A0A0A 02953F FEFFFF 02953F",
            nombreEquipo: "BANFIELD"
        },
        "band/clasica/blue": {
            codigo: "/colors blue 180 0A0A0A 02953F FEFFFF 02953F",
            nombreEquipo: "BANFIELD"
        },
    
        // LANÚS
        "lan/titular/red": {
            codigo: "/colors red 90 FFFFFF 6A2331 74192E 74192E",
            nombreEquipo: "LANÚS"
        },
        "lan/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 6A2331 74192E 74192E",
            nombreEquipo: "LANÚS"
        },
        "lan/alternativa/red": {
            codigo: "/colors red 65 6C1921 FFFFFF",
            nombreEquipo: "LANÚS"
        },
        "lan/alternativa/blue": {
            codigo: "/colors blue 65 6C1921 FFFFFF",
            nombreEquipo: "LANÚS"
        },
        "lan/tercera/red": {
            codigo: "/colors red 133 8C2246 591733 FCCBDE FCCBDE",
            nombreEquipo: "LANÚS"
        },
        "lan/tercera/blue": {
            codigo: "/colors blue 133 8C2246 591733 FCCBDE FCCBDE",
            nombreEquipo: "LANÚS"
        },
    
        // MANCHESTER UNITED
        "mun/titular/red": {
            codigo: "/colors red 90 FFFFFF D90119 C7011A AB0918",
            nombreEquipo: "MANCHESTER UNITED"
        },
        "mun/titular/blue": {
            codigo: "/colors blue 90 FFFFFF D90119 C7011A AB0918",
            nombreEquipo: "MANCHESTER UNITED"
        },
        "mun/alternativa/red": {
            codigo: "/colors red 90 191816 E1D2BF",
            nombreEquipo: "MANCHESTER UNITED"
        },
        "mun/alternativa/blue": {
            codigo: "/colors blue 90 231F20 F5EAD4",
            nombreEquipo: "MANCHESTER UNITED"
        },
        "mun/tercera/red": {
            codigo: "/colors red 90 231F20 F5EAD4",
            nombreEquipo: "MANCHESTER UNITED"
        },
        "mun/tercera/blue": {
            codigo: "/colors blue 233 F24134 2B2F35 212125",
            nombreEquipo: "MANCHESTER UNITED"
        },
    
        // MANCHESTER CITY
        "mci/titular/red": {
            codigo: "/colors red 90 FFFFFF 95c1e6",
            nombreEquipo: "MANCHESTER CITY"
        },
        "mci/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 95c1e6",
            nombreEquipo: "MANCHESTER CITY"
        },
        "mci/alternativa/red": {
            codigo: "/colors red -40 F7C100 1D1417 B20113 1D1417",
            nombreEquipo: "MANCHESTER CITY"
        },
        "mci/alternativa/blue": {
            codigo: "/colors blue -40 F7C100 1D1417 B20113 1D1417",
            nombreEquipo: "MANCHESTER CITY"
        },
        "mci/tercera/red": {
            codigo: "/colors red 90 FFFFFF 99D5F7 293158 293158",
            nombreEquipo: "MANCHESTER CITY"
        },
        "mci/tercera/blue": {
            codigo: "/colors blue 90 FFFFFF 99D5F7 293158 293158",
            nombreEquipo: "MANCHESTER CITY"
        },
        // ARSENAL FC
        "ars/titular/red": {
            codigo: "/colors red 69 D3A255 FFFFFF D10413 D10413",
            nombreEquipo: "ARSENAL FC"
        },
        "ars/titular/blue": {
            codigo: "/colors blue 69 D3A255 FFFFFF D10413 D10413",
            nombreEquipo: "ARSENAL FC"
        },
        "ars/alternativa/red": {
            codigo: "/colors red 55 233F67 FEF2AB",
            nombreEquipo: "ARSENAL FC"
        },
        "ars/alternativa/blue": {
            codigo: "/colors blue 55 233F67 FEF2AB",
            nombreEquipo: "ARSENAL FC"
        },
        "ars/tercera/red": {
            codigo: "/colors red 90 FECC00 27354F",
            nombreEquipo: "ARSENAL FC"
        },
        "ars/tercera/blue": {
            codigo: "/colors blue 90 FECC00 27354F",
            nombreEquipo: "ARSENAL FC"
        },
    
        // CHELSEA
        "che/titular/red": {
            codigo: "/colors red 66 FBB700 001489",
            nombreEquipo: "CHELSEA"
        },
        "che/titular/blue": {
            codigo: "/colors blue 66 FBB700 001489",
            nombreEquipo: "CHELSEA"
        },
        "che/alternativa/red": {
            codigo: "/colors red 52 003B7D F8F8F8",
            nombreEquipo: "CHELSEA"
        },
        "che/alternativa/blue": {
            codigo: "/colors blue 52 003B7D F8F8F8",
            nombreEquipo: "CHELSEA"
        },
        "che/tercera/red": {
            codigo: "/colors red 56 F9500F 1A1A1A 161616",
            nombreEquipo: "CHELSEA"
        },
        "che/tercera/blue": {
            codigo: "/colors blue 56 F9500F 1A1A1A 161616",
            nombreEquipo: "CHELSEA"
        },
        "che/cuarta/red": {
            codigo: "/colors red 56 F4DA45 33459F",
            nombreEquipo: "CHELSEA"
        },
        "che/cuarta/blue": {
            codigo: "/colors blue 56 F4DA45 33459F",
            nombreEquipo: "CHELSEA"
        },
    
        // PARANAENSE
        "par/titular/red": {
            codigo: "/colors red 48 FFFFFF C6012C C6012C 100E0F",
            nombreEquipo: "PARANAENSE"
        },
        "par/titular/blue": {
            codigo: "/colors blue 48 FFFFFF C6012C C6012C 100E0F",
            nombreEquipo: "PARANAENSE"
        },
        "par/alternativa/red": {
            codigo: "/colors red 48 0E0E0E FFFFFF FFFFFF BABABA",
            nombreEquipo: "PARANAENSE"
        },
        "par/alternativa/blue": {
            codigo: "/colors blue 48 0E0E0E FFFFFF FFFFFF BABABA",
            nombreEquipo: "PARANAENSE"
        },
    
        // HURACÁN
        "hur/titular/red": {
            codigo: "/colors red 52 FF0000 FFFFFF",
            nombreEquipo: "HURACÁN"
        },
        "hur/titular/blue": {
            codigo: "/colors blue 52 FF0000 FFFFFF",
            nombreEquipo: "HURACÁN"
        },
        "hur/alternativa/red": {
            codigo: "/colors red 90 FFFFFF D02939 A61829 D02939",
            nombreEquipo: "HURACÁN"
        },
        "hur/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF D02939 A61829 D02939",
            nombreEquipo: "HURACÁN"
        },
    
        // TIGRE
        "tig/titular/red": {
            codigo: "/colors red 90 FFFFFF 304383 CB1B2D 304383",
            nombreEquipo: "TIGRE"
        },
        "tig/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 304383 CB1B2D 304383",
            nombreEquipo: "TIGRE"
        },
        "tig/alternativa/red": {
            codigo: "/colors red 90 2D3E6A FFFFFF E32527 FFFFFF",
            nombreEquipo: "TIGRE"
        },
        "tig/alternativa/blue": {
            codigo: "/colors blue 90 2D3E6A FFFFFF E32527 FFFFFF",
            nombreEquipo: "TIGRE"
        },
    
        // ALEMANIA
        "ale/titular/red": {
            codigo: "/colors red 0 F0CDA5 FFFFFF 281C26 FFFFFF",
            nombreEquipo: "ALEMANIA"
        },
        "ale/titular/blue": {
            codigo: "/colors blue 0 F0CDA5 FFFFFF 281C26 FFFFFF",
            nombreEquipo: "ALEMANIA"
        },
        "ale/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 222222 1B1B1B 1B1B1B",
            nombreEquipo: "ALEMANIA"
        },
        "ale/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 222222 1B1B1B 1B1B1B",
            nombreEquipo: "ALEMANIA"
        },
        "ale/bandera/red": {
            codigo: "/colors red 90 FFFFFF 000000 DD0000 FFCE00",
            nombreEquipo: "ALEMANIA"
        },
        "ale/bandera/blue": {
            codigo: "/colors blue 90 FFFFFF 000000 DD0000 FFCE00",
            nombreEquipo: "ALEMANIA"
        },
    
        // ESPAÑA
        "esp/titular/red": {
            codigo: "/colors red 70 FFC000 BB0C10",
            nombreEquipo: "ESPAÑA"
        },
        "esp/titular/blue": {
            codigo: "/colors blue 70 FFC000 BB0C10",
            nombreEquipo: "ESPAÑA"
        },
        "esp/alternativa/red": {
            codigo: "/colors red 270 0DA2E7 A9DCF7 BEE4F9 DCF0FB",
            nombreEquipo: "ESPAÑA"
        },
        "esp/alternativa/blue": {
            codigo: "/colors blue 270 0DA2E7 A9DCF7 BEE4F9 DCF0FB",
            nombreEquipo: "ESPAÑA"
        },
        "esp/bandera/red": {
            codigo: "/colors red 90 AD1519 C60B1E FFC400 C60B1E",
            nombreEquipo: "ESPAÑA"
        },
        "esp/bandera/blue": {
            codigo: "/colors blue 90 AD1519 C60B1E FFC400 C60B1E",
            nombreEquipo: "ESPAÑA"
        },
    
        // PORTUGAL
        "por/titular/red": {
            codigo: "/colors red 130 F9CD39 A92121 A92121 01553E",
            nombreEquipo: "PORTUGAL"
        },
        "por/titular/blue": {
            codigo: "/colors blue 130 F9CD39 A92121 A92121 01553E",
            nombreEquipo: "PORTUGAL"
        },
        "por/alternativa/red": {
            codigo: "/colors red 90 030303 E1FAF8 E1FAF8 F04256",
            nombreEquipo: "PORTUGAL"
        },
        "por/alternativa/blue": {
            codigo: "/colors blue 90 030303 E1FAF8 E1FAF8 F04256",
            nombreEquipo: "PORTUGAL"
        },
    
        // ARGENTINOS JRS.
        "aaaj/titular/red": {
            codigo: "/colors red 123 005DA4 EB2A2F FFFFFF EB2A2F",
            nombreEquipo: "ARGENTINOS JRS."
        },
        "aaaj/titular/blue": {
            codigo: "/colors blue 123 005DA4 EB2A2F FFFFFF EB2A2F",
            nombreEquipo: "ARGENTINOS JRS."
        },
        "aaaj/alternativa/red": {
            codigo: "/colors red 180 EB2A2F EB2A2F FFFFFF FFFFFF",
            nombreEquipo: "ARGENTINOS JRS."
        },
        "aaaj/alternativa/blue": {
            codigo: "/colors blue 180 EB2A2F EB2A2F FFFFFF FFFFFF",
            nombreEquipo: "ARGENTINOS JRS."
        },
        "aaaj/tercera/red": {
            codigo: "/colors red 135 585F8A 0255BD FFFFFF 0255BD",
            nombreEquipo: "ARGENTINOS JRS."
        },
        "aaaj/tercera/blue": {
            codigo: "/colors blue 135 585F8A 0255BD FFFFFF 0255BD",
            nombreEquipo: "ARGENTINOS JRS."
        },
    
        // ALL BOYS
        "alb/titular/red": {
            codigo: "/colors red 180 282A27 FFFFFF",
            nombreEquipo: "ALL BOYS"
        },
        "alb/titular/blue": {
            codigo: "/colors blue 180 282A27 FFFFFF",
            nombreEquipo: "ALL BOYS"
        },
        "alb/alternativa/red": {
            codigo: "/colors red 50 D6D6D6 FFFFFF 1E1A17 FFFFFF",
            nombreEquipo: "ALL BOYS"
        },
        "alb/alternativa/blue": {
            codigo: "/colors blue 50 D6D6D6 FFFFFF 1E1A17 FFFFFF",
            nombreEquipo: "ALL BOYS"
        },
    
        // ATLANTA
        "atl/titular/red": {
            codigo: "/colors red 180 FFFFFF EDBF00 34458A EDBF00",
            nombreEquipo: "ATLANTA"
        },
        "atl/titular/blue": {
            codigo: "/colors blue 180 FFFFFF EDBF00 34458A EDBF00",
            nombreEquipo: "ATLANTA"
        },
        "atl/alternativa/red": {
            codigo: "/colors red 60 EDD41C 03264E 09203C 09203C",
            nombreEquipo: "ATLANTA"
        },
        "atl/alternativa/blue": {
            codigo: "/colors blue 60 EDD41C 03264E 09203C 09203C",
            nombreEquipo: "ATLANTA"
        },
        "atl/escudo/red": {
            codigo: "/colors red 180 FFFFFF FBBB51 18306E FBBB51",
            nombreEquipo: "ATLANTA"
        },
        "atl/escudo/blue": {
            codigo: "/colors blue 180 FFFFFF FBBB51 18306E FBBB51",
            nombreEquipo: "ATLANTA"
        },
        // BELGRANO
        "bel/titular/red": {
            codigo: "/colors red 70 FFFFFF 1A120C 009CD0 009CD0",
            nombreEquipo: "BELGRANO"
        },
        "bel/titular/blue": {
            codigo: "/colors blue 70 FFFFFF 1A120C 009CD0 009CD0",
            nombreEquipo: "BELGRANO"
        },
        "bel/alternativa/red": {
            codigo: "/colors red 70 000000 10B0FF FFFFFF FFFFFF",
            nombreEquipo: "BELGRANO"
        },
        "bel/alternativa/blue": {
            codigo: "/colors blue 70 000000 10B0FF FFFFFF FFFFFF",
            nombreEquipo: "BELGRANO"
        },
    
        // CHACARITA JRS
        "cha/titular/red": {
            codigo: "/colors red 180 FFFFFF 000000 D2191E 000000",
            nombreEquipo: "CHACARITA JRS"
        },
        "cha/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 000000 D2191E 000000",
            nombreEquipo: "CHACARITA JRS"
        },
        "cha/alternativa/red": {
            codigo: "/colors red 90 9C9C9C D2191E FFFFFF 000000",
            nombreEquipo: "CHACARITA JRS"
        },
        "cha/alternativa/blue": {
            codigo: "/colors blue 90 9C9C9C D2191E FFFFFF 000000",
            nombreEquipo: "CHACARITA JRS"
        },
    
        // TALLERES (C)
        "tal/titular/red": {
            codigo: "/colors red 180 A7A9AB 1E315A FFFFFF 1E315A",
            nombreEquipo: "TALLERES (C)"
        },
        "tal/titular/blue": {
            codigo: "/colors blue 180 A7A9AB 1E315A FFFFFF 1E315A",
            nombreEquipo: "TALLERES (C)"
        },
        "tal/alternativa/red": {
            codigo: "/colors red 90 3A4466 FFFFFF",
            nombreEquipo: "TALLERES (C)"
        },
        "tal/alternativa/blue": {
            codigo: "/colors blue 90 3A4466 FFFFFF",
            nombreEquipo: "TALLERES (C)"
        },
    
        // PLATENSE
        "pla/titular/red": {
            codigo: "/colors red 90 FD6F21 FFFFFF 5A3E22 FFFFFF",
            nombreEquipo: "PLATENSE"
        },
        "pla/titular/blue": {
            codigo: "/colors blue 90 FD6F21 FFFFFF 5A3E22 FFFFFF",
            nombreEquipo: "PLATENSE"
        },
        "pla/alternativa/red": {
            codigo: "/colors red 90 FB7401 4C3E3B FFFFFF 4C3E3B",
            nombreEquipo: "PLATENSE"
        },
        "pla/alternativa/blue": {
            codigo: "/colors blue 90 FB7401 4C3E3B FFFFFF 4C3E3B",
            nombreEquipo: "PLATENSE"
        },
        "pla/tercera/red": {
            codigo: "/colors red 180 9E6F47 C9B6A5 4A2C21 C9B6A5",
            nombreEquipo: "PLATENSE"
        },
        "pla/tercera/blue": {
            codigo: "/colors blue 180 9E6F47 C9B6A5 4A2C21 C9B6A5",
            nombreEquipo: "PLATENSE"
        },
    
        // OLIMPO
        "olp/titular/red": {
            codigo: "/colors red 180 FFFFFF 292929 EDC63A 292929",
            nombreEquipo: "OLIMPO"
        },
        "olp/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 292929 EDC63A 292929",
            nombreEquipo: "OLIMPO"
        },
    
        // SAN MARTÍN (T)
        "smt/titular/red": {
            codigo: "/colors red 0 0F0F0F E11A25 FFFFFF E11A25",
            nombreEquipo: "SAN MARTÍN (T)"
        },
        "smt/titular/blue": {
            codigo: "/colors blue 0 0F0F0F E11A25 FFFFFF E11A25",
            nombreEquipo: "SAN MARTÍN (T)"
        },
        "smt/alternativa/red": {
            codigo: "/colors red 90 FFFFFF E31515 232326 232326",
            nombreEquipo: "SAN MARTÍN (T)"
        },
        "smt/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF E31515 232326 232326",
            nombreEquipo: "SAN MARTÍN (T)"
        },
        "smt/tercera/red": {
            codigo: "/colors red 0 FFFFFF FF3A43 6F3C45 6F3C45",
            nombreEquipo: "SAN MARTÍN (T)"
        },
        "smt/tercera/blue": {
            codigo: "/colors blue 0 FFFFFF FF3A43 6F3C45 6F3C45",
            nombreEquipo: "SAN MARTÍN (T)"
        },
    
        // ATL. TUCUMÁN
        "atu/titular/red": {
            codigo: "/colors red 180 575A5B 71AFDB FFFFFF 71AFDB",
            nombreEquipo: "ATL. TUCUMÁN"
        },
        "atu/titular/blue": {
            codigo: "/colors blue 180 575A5B 71AFDB FFFFFF 71AFDB",
            nombreEquipo: "ATL. TUCUMÁN"
        },
        "atu/alternativa/red": {
            codigo: "/colors red 180 CCD5E6 151A37",
            nombreEquipo: "ATL. TUCUMÁN"
        },
        "atu/alternativa/blue": {
            codigo: "/colors blue 180 CCD5E6 151A37",
            nombreEquipo: "ATL. TUCUMÁN"
        },
    
        // FERRO
        "fco/titular/red": {
            codigo: "/colors red 66 FFFFFF 046C43 219A57 2DB563",
            nombreEquipo: "FERRO"
        },
        "fco/titular/blue": {
            codigo: "/colors blue 66 FFFFFF 00895B 01935D 01935D",
            nombreEquipo: "FERRO"
        },
        "fco/alternativa/red": {
            codigo: "/colors red 90 016C3E FAFDFF C2DCD9 51BDA3",
            nombreEquipo: "FERRO"
        },
        "fco/alternativa/blue": {
            codigo: "/colors blue 90 016C3E FAFDFF C2DCD9 51BDA3",
            nombreEquipo: "FERRO"
        },
    
        // NACIONAL (UY)
        "nac/titular/red": {
            codigo: "/colors red 180 F9020A FAF9FF",
            nombreEquipo: "NACIONAL (UY)"
        },
        "nac/titular/blue": {
            codigo: "/colors blue 180 F9020A FAF9FF",
            nombreEquipo: "NACIONAL (UY)"
        },
        "nac/alternativa/red": {
            codigo: "/colors red 55 D0142C 003895 FFFFFF 003895",
            nombreEquipo: "NACIONAL (UY)"
        },
        "nac/alternativa/blue": {
            codigo: "/colors blue 55 D0142C 003895 FFFFFF 003895",
            nombreEquipo: "NACIONAL (UY)"
        },
    
        // PEÑAROL
        "pen/titular/red": {
            codigo: "/colors red 180 FFFFFF 272525 F7CF00 272525",
            nombreEquipo: "PEÑAROL"
        },
        "pen/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 272525 F7CF00 272525",
            nombreEquipo: "PEÑAROL"
        },
        "pen/alternativa/red": {
            codigo: "/colors red 90 EABA07 F5D205 211B1B 211B1B",
            nombreEquipo: "PEÑAROL"
        },
        "pen/alternativa/blue": {
            codigo: "/colors blue 90 EABA07 F5D205 211B1B 211B1B",
            nombreEquipo: "PEÑAROL"
        },
        "pen/tercera/red": {
            codigo: "/colors red 60 EAD300 8B8A8F A1A0A5 B2B1B6",
            nombreEquipo: "PEÑAROL"
        },
        "pen/tercera/blue": {
            codigo: "/colors blue 60 EAD300 8B8A8F A1A0A5 B2B1B6",
            nombreEquipo: "PEÑAROL"
        },
    
        // QUILMES
        "qui/titular/red": {
            codigo: "/colors red 90 032051 9BADBC FFFFFF FFFFFF",
            nombreEquipo: "QUILMES"
        },
        "qui/titular/blue": {
            codigo: "/colors blue 90 032051 9BADBC FFFFFF FFFFFF",
            nombreEquipo: "QUILMES"
        },
        "qui/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 004FC6 00215E 00215E",
            nombreEquipo: "QUILMES"
        },
        "qui/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 004FC6 00215E 00215E",
            nombreEquipo: "QUILMES"
        },
        "qui/tercera/red": {
            codigo: "/colors red 152 FFFFFF 2C2F36 15181F 2C2F36",
            nombreEquipo: "QUILMES"
        },
        "qui/tercera/blue": {
            codigo: "/colors blue 152 FFFFFF 2C2F36 15181F 2C2F36",
            nombreEquipo: "QUILMES"
        },
    
        // NUEVA CHICAGO
        "nch/titular/red": {
            codigo: "/colors red 360 FFFFFF 3AC991 000000 3AC991",
            nombreEquipo: "NUEVA CHICAGO"
        },
        "nch/titular/blue": {
            codigo: "/colors blue 360 FFFFFF 3AC991 000000 3AC991",
            nombreEquipo: "NUEVA CHICAGO"
        },
    
        // MORÓN
        "mor/titular/red": {
            codigo: "/colors red 90 242B35 FFFFFF E21C1C FFFFFF",
            nombreEquipo: "MORÓN"
        },
        "mor/titular/blue": {
            codigo: "/colors blue 90 242B35 FFFFFF E21C1C FFFFFF",
            nombreEquipo: "MORÓN"
        },
    
        // UNIÓN
        "uni/titular/red": {
            codigo: "/colors red 180 007FD6 DA251D FFFFFF DA251D",
            nombreEquipo: "UNIÓN"
        },
        "uni/titular/blue": {
            codigo: "/colors blue 180 007FD6 DA251D FFFFFF DA251D",
            nombreEquipo: "UNIÓN"
        },
        "uni/alternativa/red": {
            codigo: "/colors red 129 F2F3F5 ED1F29 0177CF 0295E3",
            nombreEquipo: "UNIÓN"
        },
        "uni/alternativa/blue": {
            codigo: "/colors blue 129 F2F3F5 ED1F29 0177CF 0295E3",
            nombreEquipo: "UNIÓN"
        },
        // COLÓN
        "csf/titular/red": {
            codigo: "/colors red 0 E0C069 C80000 000000",
            nombreEquipo: "COLÓN"
        },
        "csf/titular/blue": {
            codigo: "/colors blue 0 E0C069 C80000 000000",
            nombreEquipo: "COLÓN"
        },
        "csf/alternativa/red": {
            codigo: "/colors red 61 000000 7B0C1D FFFFFF FFFFFF",
            nombreEquipo: "COLÓN"
        },
        "csf/alternativa/blue": {
            codigo: "/colors blue 61 000000 7B0C1D FFFFFF FFFFFF",
            nombreEquipo: "COLÓN"
        },
        "csf/tercera/red": {
            codigo: "/colors red 60 F9C78C 18161B",
            nombreEquipo: "COLÓN"
        },
        "csf/tercera/blue": {
            codigo: "/colors blue 60 F9C78C 18161B",
            nombreEquipo: "COLÓN"
        },
    
        // ARSENAL DE SARANDÍ
        "arse/titular/red": {
            codigo: "/colors red 33 FFFFFF 00AEEF EE3E34 00AEEF",
            nombreEquipo: "ARSENAL DE SARANDÍ"
        },
        "arse/titular/blue": {
            codigo: "/colors blue 33 FFFFFF 00AEEF EE3E34 00AEEF",
            nombreEquipo: "ARSENAL DE SARANDÍ"
        },
        "arse/alternativa/red": {
            codigo: "/colors red 33 FFFFFF 1D1E1E F52626 1D1E1E",
            nombreEquipo: "ARSENAL DE SARANDÍ"
        },
        "arse/alternativa/blue": {
            codigo: "/colors blue 33 FFFFFF 1D1E1E F52626 1D1E1E",
            nombreEquipo: "ARSENAL DE SARANDÍ"
        },
        "arse/tercera/red": {
            codigo: "/colors red 180 E61B37 FFFFFF FFFFFF 3BA1F6",
            nombreEquipo: "ARSENAL DE SARANDÍ"
        },
        "arse/tercera/blue": {
            codigo: "/colors blue 180 E61B37 FFFFFF FFFFFF 3BA1F6",
            nombreEquipo: "ARSENAL DE SARANDÍ"
        },
    
        // DOCK SUD
        "doc/titular/red": {
            codigo: "/colors red 180 FFFFFF 254494 F3C706 254494",
            nombreEquipo: "DOCK SUD"
        },
        "doc/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 254494 F3C706 254494",
            nombreEquipo: "DOCK SUD"
        },
    
        // COLOMBIA
        "col/titular/red": {
            codigo: "/colors red 240 3C4462 FDFD02",
            nombreEquipo: "COLOMBIA"
        },
        "col/titular/blue": {
            codigo: "/colors blue 240 3C4462 FDFD02",
            nombreEquipo: "COLOMBIA"
        },
        "col/alternativa/red": {
            codigo: "/colors red 60 F1EB56 3671AF 3168A0 1E477C",
            nombreEquipo: "COLOMBIA"
        },
        "col/alternativa/blue": {
            codigo: "/colors blue 60 F1EB56 3671AF 3168A0 1E477C",
            nombreEquipo: "COLOMBIA"
        },
        "col/bandera/red": {
            codigo: "/colors red 90 FFFFFF FCD116 003893 CE1126",
            nombreEquipo: "COLOMBIA"
        },
        "col/bandera/blue": {
            codigo: "/colors blue 90 FFFFFF FCD116 003893 CE1126",
            nombreEquipo: "COLOMBIA"
        },
    
        // PERÚ
        "per/titular/red": {
            codigo: "/colors red 52 000000 FFFFFF DF1117 FFFFFF",
            nombreEquipo: "PERÚ"
        },
        "per/titular/blue": {
            codigo: "/colors blue 52 000000 FFFFFF DF1117 FFFFFF",
            nombreEquipo: "PERÚ"
        },
        "per/alternativa/red": {
            codigo: "/colors red 52 000000 DC1E1E FFFFFF DC1E1E",
            nombreEquipo: "PERÚ"
        },
        "per/alternativa/blue": {
            codigo: "/colors blue 52 000000 DC1E1E FFFFFF DC1E1E",
            nombreEquipo: "PERÚ"
        },
    
        // WEST BROM
        "wba/titular/red": {
            codigo: "/colors red 180 DE2B2E FFFFFF 1B2A41 FFFFFF",
            nombreEquipo: "WEST BROM"
        },
        "wba/titular/blue": {
            codigo: "/colors blue 180 DE2B2E FFFFFF 1B2A41 FFFFFF",
            nombreEquipo: "WEST BROM"
        },
    
        // ASTON VILLA
        "avl/titular/red": {
            codigo: "/colors red 130 FFFFFF C5DBF3 97012F 6A0D2A",
            nombreEquipo: "ASTON VILLA"
        },
        "avl/titular/blue": {
            codigo: "/colors blue 130 FFFFFF C5DBF3 97012F 6A0D2A",
            nombreEquipo: "ASTON VILLA"
        },
    
        // FULHAM FC
        "ful/titular/red": {
            codigo: "/colors red 90 1E202C F0EFF5",
            nombreEquipo: "FULHAM FC"
        },
        "ful/titular/blue": {
            codigo: "/colors blue 90 1E202C F0EFF5",
            nombreEquipo: "FULHAM FC"
        },
        "ful/alternativa/red": {
            codigo: "/colors red 180 FFFFFF C71B29 372729 C71B29",
            nombreEquipo: "FULHAM FC"
        },
        "ful/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF C71B29 372729 C71B29",
            nombreEquipo: "FULHAM FC"
        },
        "ful/clasica/red": {
            codigo: "/colors red 180 E41B15 000000 FFFFFF 000000",
            nombreEquipo: "FULHAM FC"
        },
        "ful/clasica/blue": {
            codigo: "/colors blue 180 E41B15 000000 FFFFFF 000000",
            nombreEquipo: "FULHAM FC"
        },
    
        // LEICESTER
        "lei/titular/red": {
            codigo: "/colors red 270 FFFFFF 364CFA 3035FF",
            nombreEquipo: "LEICESTER"
        },
        "lei/titular/blue": {
            codigo: "/colors blue 270 FFFFFF 364CFA 3035FF",
            nombreEquipo: "LEICESTER"
        },
    
        // DANUBIO
        "dan/titular/red": {
            codigo: "/colors red 50 DB0D24 FFFFFF 131514 FFFFFF",
            nombreEquipo: "DANUBIO"
        },
        "dan/titular/blue": {
            codigo: "/colors blue 50 DB0D24 FFFFFF 131514 FFFFFF",
            nombreEquipo: "DANUBIO"
        },
    
        // RAMPLA JRS
        "ram/titular/red": {
            codigo: "/colors red 180 FFFFFF FF2E3B 1D836D FF2E3B",
            nombreEquipo: "RAMPLA JRS"
        },
        "ram/titular/blue": {
            codigo: "/colors blue 180 FFFFFF FF2E3B 1D836D FF2E3B",
            nombreEquipo: "RAMPLA JRS"
        },
    
        // SACACHISPAS
        "sch/titular/red": {
            codigo: "/colors red 180 201766 C8B8F8 FFFFFF C8B8F8",
            nombreEquipo: "SACACHISPAS"
        },
        "sch/titular/blue": {
            codigo: "/colors blue 180 201766 C8B8F8 FFFFFF C8B8F8",
            nombreEquipo: "SACACHISPAS"
        },
        "sch/alternativa/red": {
            codigo: "/colors red 56 FFFFFF 5944A5 AF94D9",
            nombreEquipo: "SACACHISPAS"
        },
        "sch/alternativa/blue": {
            codigo: "/colors blue 56 FFFFFF 5944A5 AF94D9",
            nombreEquipo: "SACACHISPAS"
        },
    
        // HOLANDA
        "hol/titular/red": {
            codigo: "/colors red 66 221817 FEA304 FEB71E FFE064",
            nombreEquipo: "HOLANDA"
        },
        "hol/titular/blue": {
            codigo: "/colors blue 66 221817 FEA304 FEB71E FFE064",
            nombreEquipo: "HOLANDA"
        },
        "hol/alternativa/red": {
            codigo: "/colors red 90 FF7309 1D1D1F",
            nombreEquipo: "HOLANDA"
        },
        "hol/alternativa/blue": {
            codigo: "/colors blue 90 FF7309 1D1D1F",
            nombreEquipo: "HOLANDA"
        },
        "hol/alternativa/2019/red": {
            codigo: "/colors red 90 0D285F 4ECDE4 47BAD9 3CA1C7",
            nombreEquipo: "HOLANDA"
        },
        "hol/alternativa/2019/blue": {
            codigo: "/colors blue 90 0D285F 4ECDE4 47BAD9 3CA1C7",
            nombreEquipo: "HOLANDA"
        },
        "hol/retro/red": {
            codigo: "/colors red 90 2E2624 F87032 F7965F F2BEA6",
            nombreEquipo: "HOLANDA"
        },
        "hol/retro/blue": {
            codigo: "/colors blue 90 2E2624 F87032 F7965F F2BEA6",
            nombreEquipo: "HOLANDA"
        },
        "hol/bandera/red": {
            codigo: "/colors red 90 000000 AE1C28 FFFFFF 21468B",
            nombreEquipo: "HOLANDA"
        },
        "hol/bandera/blue": {
            codigo: "/colors blue 90 000000 AE1C28 FFFFFF 21468B",
            nombreEquipo: "HOLANDA"
        },
        "hol/titular/2014/red": {
            codigo: "/colors red 240 F9F8F6 FF6F1C",
            nombreEquipo: "HOLANDA"
        },
        "hol/titular/2014/blue": {
            codigo: "/colors blue 240 F9F8F6 FF6F1C",
            nombreEquipo: "HOLANDA"
        },
    // BOLIVIA
        "bol/titular/red": {
            codigo: "/colors red 180 FFFFFF 26A057",
            nombreEquipo: "BOLIVIA"
        },
        "bol/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 26A057",
            nombreEquipo: "BOLIVIA"
        },
    
    // ITALIA
        "ita/titular/red": {
            codigo: "/colors red 65 F1F3F2 167ED0 1268BF 0959B8",
            nombreEquipo: "ITALIA"
        },
        "ita/titular/blue": {
            codigo: "/colors blue 65 F1F3F2 167ED0 1268BF 0959B8",
            nombreEquipo: "ITALIA"
        },
        "ita/alternativa/red": {
            codigo: "/colors red 69 004FAC 213651 F4F4F2 F4F4F2",
            nombreEquipo: "ITALIA"
        },
        "ita/alternativa/blue": {
            codigo: "/colors blue 69 004FAC 213651 F4F4F2 F4F4F2",
            nombreEquipo: "ITALIA"
        },
        "ita/bandera/red": {
            codigo: "/colors red 0 0064AA 009E3F FFFFFF E40321",
            nombreEquipo: "ITALIA"
        },
        "ita/bandera/blue": {
            codigo: "/colors blue 0 0064AA 009E3F FFFFFF E40321",
            nombreEquipo: "ITALIA"
        },
    
    // INGLATERRA
        "ing/titular/red": {
            codigo: "/colors red 180 F3010F F8F8F8",
            nombreEquipo: "INGLATERRA"
        },
        "ing/titular/blue": {
            codigo: "/colors blue 180 F3010F F8F8F8",
            nombreEquipo: "INGLATERRA"
        },
        "ing/alternativa/red": {
            codigo: "/colors red 60 F2F4F3 F4080A",
            nombreEquipo: "INGLATERRA"
        },
        "ing/alternativa/blue": {
            codigo: "/colors blue 60 F2F4F3 F4080A",
            nombreEquipo: "INGLATERRA"
        },
    
    // PARAGUAY
        "pgy/titular/red": {
            codigo: "/colors red 180 0380DC F61527 FFFFFF F61527",
            nombreEquipo: "PARAGUAY"
        },
        "pgy/titular/blue": {
            codigo: "/colors blue 180 0380DC F61527 FFFFFF F61527",
            nombreEquipo: "PARAGUAY"
        },
        "pgy/alternativa/red": {
            codigo: "/colors red 55 FFFFFF 024EAE 024EAE 033C9A",
            nombreEquipo: "PARAGUAY"
        },
        "pgy/alternativa/blue": {
            codigo: "/colors blue 55 FFFFFF 024EAE 024EAE 033C9A",
            nombreEquipo: "PARAGUAY"
        },
    
    // VENEZUELA
        "ven/titular/red": {
            codigo: "/colors red 180 FFFFFF 8F021D",
            nombreEquipo: "VENEZUELA"
        },
        "ven/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 8F021D",
            nombreEquipo: "VENEZUELA"
        },
        "ven/alternativa/red": {
            codigo: "/colors red 90 8F2937 F8FAF9 F8FAF9 F3F5F4",
            nombreEquipo: "VENEZUELA"
        },
        "ven/alternativa/blue": {
            codigo: "/colors blue 90 8F2937 F8FAF9 F8FAF9 F3F5F4",
            nombreEquipo: "VENEZUELA"
        },
    
    // QATAR
        "qat/titular/red": {
            codigo: "/colors red 90 F1EFF4 9B003C 940139 940139",
            nombreEquipo: "QATAR"
        },
        "qat/titular/blue": {
            codigo: "/colors blue 90 F1EFF4 9B003C 940139 940139",
            nombreEquipo: "QATAR"
        },
        "qat/alternativa/red": {
            codigo: "/colors red 90 9B232F FFFFFF",
            nombreEquipo: "QATAR"
        },
        "qat/alternativa/blue": {
            codigo: "/colors blue 90 9B232F FFFFFF",
            nombreEquipo: "QATAR"
        },
    
    // AJAX
        "aja/titular/red": {
            codigo: "/colors red 180 B8BCC2 FCFAFC E11025 FCFAFC",
            nombreEquipo: "AJAX"
        },
        "aja/titular/blue": {
            codigo: "/colors blue 180 B8BCC2 FCFAFC E11025 FCFAFC",
            nombreEquipo: "AJAX"
        },
        "aja/alternativa/red": {
            codigo: "/colors red 180 EE7024 255459 05707C 255459",
            nombreEquipo: "AJAX"
        },
        "aja/alternativa/blue": {
            codigo: "/colors blue 180 EE7024 255459 05707C 255459",
            nombreEquipo: "AJAX"
        },
    
    // PSV
        "psv/titular/red": {
            codigo: "/colors red 180 030303 FFFFFF FA2747 FFFFFF",
            nombreEquipo: "PSV"
        },
        "psv/titular/blue": {
            codigo: "/colors blue 180 030303 FFFFFF FA2747 FFFFFF",
            nombreEquipo: "PSV"
        },
        // FEYENOORD
        "fey/titular/red": {
            codigo: "/colors red 180 000000 FFFFFF FA203B",
            nombreEquipo: "FEYENOORD"
        },
        "fey/titular/blue": {
            codigo: "/colors blue 180 000000 FFFFFF FA203B",
            nombreEquipo: "FEYENOORD"
        },
    
        // PSG
        "psg/titular/red": {
            codigo: "/colors red 180 F4F5F7 25406C 203C65 25406C",
            nombreEquipo: "PSG"
        },
        "psg/titular/blue": {
            codigo: "/colors blue 180 F4F5F7 25406C 203C65 25406C",
            nombreEquipo: "PSG"
        },
        "psg/alternativa/red": {
            codigo: "/colors red 180 3B363C F5F4F9 FFD4E5 F5F4F9",
            nombreEquipo: "PSG"
        },
        "psg/alternativa/blue": {
            codigo: "/colors blue 180 3B363C F5F4F9 FFD4E5 F5F4F9",
            nombreEquipo: "PSG"
        },
        "psg/tercera/red": {
            codigo: "/colors red 90 F5F5F7 26252B 75767E 26252B",
            nombreEquipo: "PSG"
        },
        "psg/tercera/blue": {
            codigo: "/colors blue 90 F5F5F7 26252B 75767E 26252B",
            nombreEquipo: "PSG"
        },
    
        // DEPORTIVO RIESTRA
        "rie/titular/red": {
            codigo: "/colors red 40 FFFFFF 1D1C21",
            nombreEquipo: "DEP. RIESTRA"
        },
        "rie/titular/blue": {
            codigo: "/colors blue 40 FFFFFF 1D1C21",
            nombreEquipo: "DEP. RIESTRA"
        },
        "rie/alternativa/red": {
            codigo: "/colors red 40 19161B FDFDFD",
            nombreEquipo: "DEP. RIESTRA"
        },
        "rie/alternativa/blue": {
            codigo: "/colors blue 40 19161B FDFDFD",
            nombreEquipo: "DEP. RIESTRA"
        },
    
        // CENTRAL CÓRDOBA
        "ccs/titular/red": {
            codigo: "/colors red 180 C22B34 231F20 FFFFFF 231F20",
            nombreEquipo: "CENTRAL CÓRDOBA"
        },
        "ccs/titular/blue": {
            codigo: "/colors blue 180 C22B34 231F20 FFFFFF 231F20",
            nombreEquipo: "CENTRAL CÓRDOBA"
        },
        "ccs/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 9C181C 9C181C C02122",
            nombreEquipo: "CENTRAL CÓRDOBA"
        },
        "ccs/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 9C181C 9C181C C02122",
            nombreEquipo: "CENTRAL CÓRDOBA"
        },
        "ccs/tercera/red": {
            codigo: "/colors red 50 CA0009 E7E7E7 FBFBFB",
            nombreEquipo: "CENTRAL CÓRDOBA"
        },
        "ccs/tercera/blue": {
            codigo: "/colors blue 50 CA0009 E7E7E7 FBFBFB",
            nombreEquipo: "CENTRAL CÓRDOBA"
        },
    
        // OGC NICE
        "ogc/titular/red": {
            codigo: "/colors red 180 FFFFFF FD2725 0C0D11 FD2725",
            nombreEquipo: "OGC NICE"
        },
        "ogc/titular/blue": {
            codigo: "/colors blue 180 FFFFFF FD2725 0C0D11 FD2725",
            nombreEquipo: "OGC NICE"
        },
    
        // OLYMPIQUE MARSELLA
        "om/titular/red": {
            codigo: "/colors red 72 43CEEC 29CCF1 F6F4FC F6F4FC",
            nombreEquipo: "OLYMPIQUE MARSELLA"
        },
        "om/titular/blue": {
            codigo: "/colors blue 72 43CEEC 29CCF1 F6F4FC F6F4FC",
            nombreEquipo: "OLYMPIQUE MARSELLA"
        },
        "om/alternativa/red": {
            codigo: "/colors red 61 FFFFFF 24ADEA 1473E5",
            nombreEquipo: "OLYMPIQUE MARSELLA"
        },
        "om/alternativa/blue": {
            codigo: "/colors blue 61 FFFFFF 24ADEA 1473E5",
            nombreEquipo: "OLYMPIQUE MARSELLA"
        },
    
        // AS ROMA
        "rom/titular/red": {
            codigo: "/colors red 0 FFB200 8F001C",
            nombreEquipo: "AS ROMA"
        },
        "rom/titular/blue": {
            codigo: "/colors blue 0 FFB200 8F001C",
            nombreEquipo: "AS ROMA"
        },
        "rom/alternativa/red": {
            codigo: "/colors red 180 6E0F19 F6F7FA",
            nombreEquipo: "AS ROMA"
        },
        "rom/alternativa/blue": {
            codigo: "/colors blue 180 6E0F19 F6F7FA",
            nombreEquipo: "AS ROMA"
        },
        "rom/tercera/red": {
            codigo: "/colors red 90 F9B105 172952 1C2446",
            nombreEquipo: "AS ROMA"
        },
        "rom/tercera/blue": {
            codigo: "/colors blue 90 F9B105 172952 1C2446",
            nombreEquipo: "AS ROMA"
        },
    
        // FIORENTINA
        "fio/titular/red": {
            codigo: "/colors red 180 FFFFFF 55338A",
            nombreEquipo: "FIORENTINA"
        },
        "fio/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 55338A",
            nombreEquipo: "FIORENTINA"
        },
        "fio/alternativa/red": {
            codigo: "/colors red 90 8559BD FFFFFF 422A6E FFFFFF",
            nombreEquipo: "FIORENTINA"
        },
        "fio/alternativa/blue": {
            codigo: "/colors blue 90 8559BD FFFFFF 422A6E FFFFFF",
            nombreEquipo: "FIORENTINA"
        },
    
        // LAZIO
        "laz/titular/red": {
            codigo: "/colors red 180 FFFFFF 81C6EE 8CCAEE 81C6EE",
            nombreEquipo: "LAZIO"
        },
        "laz/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 81C6EE 8CCAEE 81C6EE",
            nombreEquipo: "LAZIO"
        },
        "laz/alternativa/red": {
            codigo: "/colors red 90 1E2E50 FFFFFF 86BBEF FFFFFF",
            nombreEquipo: "LAZIO"
        },
        "laz/alternativa/blue": {
            codigo: "/colors blue 90 1E2E50 FFFFFF 86BBEF FFFFFF",
            nombreEquipo: "LAZIO"
        },
        "laz/tercera/red": {
            codigo: "/colors red 90 C3E9FE 0F1217",
            nombreEquipo: "LAZIO"
        },
        "laz/tercera/blue": {
            codigo: "/colors blue 90 C3E9FE 0F1217",
            nombreEquipo: "LAZIO"
        },
    
        // SAN MARTÍN (SJ)
        "smsj/titular/red": {
            codigo: "/colors red 180 FFFFFF 131311 4EA280 131311",
            nombreEquipo: "SAN MARTIN (SJ)"
        },
        "smsj/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 131311 4EA280 131311",
            nombreEquipo: "SAN MARTIN (SJ)"
        },
        "smsj/alternativa/red": {
            codigo: "/colors red 180 030303 FFFFFF 48C079 FFFFFF",
            nombreEquipo: "SAN MARTIN (SJ)"
        },
        "smsj/alternativa/blue": {
            codigo: "/colors blue 180 030303 FFFFFF 48C079 FFFFFF",
            nombreEquipo: "SAN MARTIN (SJ)"
        },
    
        // GODOY CRUZ
        "god/titular/red": {
            codigo: "/colors red 180 73B0E1 096FCC FFFFFF 096FCC",
            nombreEquipo: "GODOY CRUZ"
        },
        "god/titular/blue": {
            codigo: "/colors blue 180 73B0E1 096FCC FFFFFF 096FCC",
            nombreEquipo: "GODOY CRUZ"
        },
        "god/alternativa/red": {
            codigo: "/colors red 90 055BD2 0060C7 FFFFFF FFFFFF",
            nombreEquipo: "GODOY CRUZ"
        },
        "god/alternativa/blue": {
            codigo: "/colors blue 90 055BD2 0060C7 FFFFFF FFFFFF",
            nombreEquipo: "GODOY CRUZ"
        },
        "god/tercera/red": {
            codigo: "/colors red 90 FFFFFF 881325 5F0D1A 881325",
            nombreEquipo: "GODOY CRUZ"
        },
        "god/tercera/blue": {
            codigo: "/colors blue 90 FFFFFF 881325 5F0D1A 881325",
            nombreEquipo: "GODOY CRUZ"
        },
    
        // VÉLEZ
        "vel/titular/red": {
            codigo: "/colors red 180 0063A8 FFFFFF",
            nombreEquipo: "VÉLEZ"
        },
        "vel/titular/blue": {
            codigo: "/colors blue 180 0063A8 FFFFFF",
            nombreEquipo: "VÉLEZ"
        },
        "vel/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 2C3EA2 2E42B5 3248C4",
            nombreEquipo: "VÉLEZ"
        },
        "vel/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 2C3EA2 2E42B5 3248C4",
            nombreEquipo: "VÉLEZ"
        },
        "vel/tercera/red": {
            codigo: "/colors red 0 000000 097C7F FFFFFF F11931",
            nombreEquipo: "VÉLEZ"
        },
        "vel/tercera/blue": {
            codigo: "/colors blue 0 000000 097C7F FFFFFF F11931",
            nombreEquipo: "VÉLEZ"
        },
    
        // FLAMENGO
        "fla/titular/red": {
            codigo: "/colors red 90 FFFFFF DD0125 211F25 DD0125",
            nombreEquipo: "FLAMENGO"
        },
        "fla/titular/blue": {
            codigo: "/colors blue 90 FFFFFF DD0125 211F25 DD0125",
            nombreEquipo: "FLAMENGO"
        },
        "fla/alternativa/red": {
            codigo: "/colors red 90 DE111E EEEFF1 1B1F1F 872C32",
            nombreEquipo: "FLAMENGO"
        },
        "fla/alternativa/blue": {
            codigo: "/colors blue 90 DE111E EEEFF1 1B1F1F 872C32",
            nombreEquipo: "FLAMENGO"
        },
        "fla/tercera/red": {
            codigo: "/colors red 90 C1E23F 36363C",
            nombreEquipo: "FLAMENGO"
        },
        "fla/tercera/blue": {
            codigo: "/colors blue 90 C1E23F 36363C",
            nombreEquipo: "FLAMENGO"
        },
        // SC INTERNACIONAL
        "sci/titular/red": {
            codigo: "/colors red 90 FFFFFF FF020C",
            nombreEquipo: "SC INTERNACIONAL"
        },
        "sci/titular/blue": {
            codigo: "/colors blue 90 FFFFFF FF020C",
            nombreEquipo: "SC INTERNACIONAL"
        },
        "sci/alternativa/red": {
            codigo: "/colors red 64 66020A F9F9FA C71B20 F9F9FA",
            nombreEquipo: "SC INTERNACIONAL"
        },
        "sci/alternativa/blue": {
            codigo: "/colors blue 64 66020A F9F9FA C71B20 F9F9FA",
            nombreEquipo: "SC INTERNACIONAL"
        },
    
        // SANTOS FC
        "san/titular/red": {
            codigo: "/colors red 90 3B4043 F1F5F6",
            nombreEquipo: "SANTOS FC"
        },
        "san/titular/blue": {
            codigo: "/colors blue 90 3B4043 F1F5F6",
            nombreEquipo: "SANTOS FC"
        },
        "san/alternativa/red": {
            codigo: "/colors red 180 D6BD62 2C2B33 F9F8FD 2C2B33",
            nombreEquipo: "SANTOS FC"
        },
        "san/alternativa/blue": {
            codigo: "/colors blue 180 D6BD62 2C2B33 F9F8FD 2C2B33",
            nombreEquipo: "SANTOS FC"
        },
        "san/tercera/red": {
            codigo: "/colors red 225 A7ADB1 282A35 282A35 393C45",
            nombreEquipo: "SANTOS FC"
        },
        "san/tercera/blue": {
            codigo: "/colors blue 225 A7ADB1 282A35 282A35 393C45",
            nombreEquipo: "SANTOS FC"
        },
    
        // SAO PAULO
        "sao/titular/red": {
            codigo: "/colors red 90 3C3B3E F91E0B F5F5F5 1C1D21",
            nombreEquipo: "SAO PAULO"
        },
        "sao/titular/blue": {
            codigo: "/colors blue 90 3C3B3E F91E0B F5F5F5 1C1D21",
            nombreEquipo: "SAO PAULO"
        },
        "sao/alternativa/red": {
            codigo: "/colors red 180 F2273A 221C1E EAE8EB ED2436",
            nombreEquipo: "SAO PAULO"
        },
        "sao/alternativa/blue": {
            codigo: "/colors blue 180 F2273A 221C1E EAE8EB ED2436",
            nombreEquipo: "SAO PAULO"
        },
    
        // CORINTHIANS
        "cor/titular/red": {
            codigo: "/colors red 90 000000 F4F4F6",
            nombreEquipo: "CORINTHIANS"
        },
        "cor/titular/blue": {
            codigo: "/colors blue 90 000000 F4F4F6",
            nombreEquipo: "CORINTHIANS"
        },
        "cor/alternativa/red": {
            codigo: "/colors red 360 FFFFFF 1F1E20",
            nombreEquipo: "CORINTHIANS"
        },
        "cor/alternativa/blue": {
            codigo: "/colors blue 360 FFFFFF 1F1E20",
            nombreEquipo: "CORINTHIANS"
        },
    
        // VASCO DA GAMA
        "vas/titular/red": {
            codigo: "/colors red 29 D42A2A 19181B E6E6E4 19181B",
            nombreEquipo: "VASCO DA GAMA"
        },
        "vas/titular/blue": {
            codigo: "/colors blue 29 D42A2A 19181B E6E6E4 19181B",
            nombreEquipo: "VASCO DA GAMA"
        },
        "vas/alternativa/red": {
            codigo: "/colors red 29 D42A2A FEFEFE 1C1C1C FEFEFE",
            nombreEquipo: "VASCO DA GAMA"
        },
        "vas/alternativa/blue": {
            codigo: "/colors blue 29 D42A2A FEFEFE 1C1C1C FEFEFE",
            nombreEquipo: "VASCO DA GAMA"
        },
    
        // BOTAFOGO
        "bot/titular/red": {
            codigo: "/colors red 180 777B87 1C1F26 FFFFFF 1C1F26",
            nombreEquipo: "BOTAFOGO"
        },
        "bot/titular/blue": {
            codigo: "/colors blue 180 777B87 1C1F26 FFFFFF 1C1F26",
            nombreEquipo: "BOTAFOGO"
        },
        "bot/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 161719",
            nombreEquipo: "BOTAFOGO"
        },
        "bot/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 161719",
            nombreEquipo: "BOTAFOGO"
        },
    
        // FLUMINENSE
        "flu/titular/red": {
            codigo: "/colors red 180 FFFFFF 9E0424 1C6137 9E0424",
            nombreEquipo: "FLUMINENSE"
        },
        "flu/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 9E0424 1C6137 9E0424",
            nombreEquipo: "FLUMINENSE"
        },
    
        // MINEIRO
        "cam/titular/red": {
            codigo: "/colors red 180 F21828 EFF2F7 2B2529 EFF2F7",
            nombreEquipo: "MINEIRO"
        },
        "cam/titular/blue": {
            codigo: "/colors blue 180 F21828 EFF2F7 2B2529 EFF2F7",
            nombreEquipo: "MINEIRO"
        },
        "cam/alternativa/red": {
            codigo: "/colors red 180 1D1E24 FFFFFF",
            nombreEquipo: "MINEIRO"
        },
        "cam/alternativa/blue": {
            codigo: "/colors blue 180 1D1E24 FFFFFF",
            nombreEquipo: "MINEIRO"
        },
    
        // ATLÉTICO NACIONAL (COL)
        "atn/titular/red": {
            codigo: "/colors red 180 B2C9BB 178B36 FCFCFC 178B36",
            nombreEquipo: "ATL. NACIONAL (COL)"
        },
        "atn/titular/blue": {
            codigo: "/colors blue 180 B2C9BB 178B36 FCFCFC 178B36",
            nombreEquipo: "ATL. NACIONAL (COL)"
        },
        "atn/alternativa/red": {
            codigo: "/colors red -136 008A26 F6F6F8 E6E8EA",
            nombreEquipo: "ATL. NACIONAL (COL)"
        },
        "atn/alternativa/blue": {
            codigo: "/colors blue -136 008A26 F6F6F8 E6E8EA",
            nombreEquipo: "ATL. NACIONAL (COL)"
        },
    
        // MILLONARIOS
        "mil/titular/red": {
            codigo: "/colors red 180 FFFFFF 0846AD",
            nombreEquipo: "MILLONARIOS"
        },
        "mil/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 0846AD",
            nombreEquipo: "MILLONARIOS"
        },
        "mil/alternativa/red": {
            codigo: "/colors red 180 093794 F7F7F7",
            nombreEquipo: "MILLONARIOS"
        },
        "mil/alternativa/blue": {
            codigo: "/colors blue 180 093794 F7F7F7",
            nombreEquipo: "MILLONARIOS"
        },
    
        // AMÉRICA DE CALI
        "ame/titular/red": {
            codigo: "/colors red 60 FFFFFF E81B1D",
            nombreEquipo: "AMÉRICA DE CALI"
        },
        "ame/titular/blue": {
            codigo: "/colors blue 60 FFFFFF E81B1D",
            nombreEquipo: "AMÉRICA DE CALI"
        },
        "ame/alternativa/red": {
            codigo: "/colors red 60 C91212 F8F8F8",
            nombreEquipo: "AMÉRICA DE CALI"
        },
        "ame/alternativa/blue": {
            codigo: "/colors blue 60 C91212 F8F8F8",
            nombreEquipo: "AMÉRICA DE CALI"
        },
    
        // SANTA FE (COL)
        "sfe/titular/red": {
            codigo: "/colors red 90 E0E0E0 F6F6F8 EB0505 EB0505",
            nombreEquipo: "SANTA FE (COL)"
        },
        "sfe/titular/blue": {
            codigo: "/colors blue 90 E0E0E0 F6F6F8 EB0505 EB0505",
            nombreEquipo: "SANTA FE (COL)"
        },
        "sfe/alternativa/red": {
            codigo: "/colors red 90 EB0505 EB0505 FFFFFF FFFFFF",
            nombreEquipo: "SANTA FE (COL)"
        },
        "sfe/alternativa/blue": {
            codigo: "/colors blue 90 EB0505 EB0505 FFFFFF FFFFFF",
            nombreEquipo: "SANTA FE (COL)"
        },
    
        // DEPORTIVO CALI
        "cal/titular/red": {
            codigo: "/colors red 90 FFFFFF 05393C 013037 05393C",
            nombreEquipo: "DEPORTIVO CALI"
        },
        "cal/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 05393C 013037 05393C",
            nombreEquipo: "DEPORTIVO CALI"
        },
        "cal/alternativa/red": {
            codigo: "/colors red 90 1B474B EFEFEF FFFFFF EFEFEF",
            nombreEquipo: "DEPORTIVO CALI"
        },
        "cal/alternativa/blue": {
            codigo: "/colors blue 90 1B474B EFEFEF FFFFFF EFEFEF",
            nombreEquipo: "DEPORTIVO CALI"
        },
        "cal/tercera/red": {
            codigo: "/colors red 90 4E514D 7DF356",
            nombreEquipo: "DEPORTIVO CALI"
        },
        "cal/tercera/blue": {
            codigo: "/colors blue 90 4E514D 7DF356",
            nombreEquipo: "DEPORTIVO CALI"
        },
    
        // ONCE CALDAS
        "onc/titular/red": {
            codigo: "/colors red 180 171717 FFFFFF",
            nombreEquipo: "ONCE CALDAS"
        },
        "onc/titular/blue": {
            codigo: "/colors blue 180 171717 FFFFFF",
            nombreEquipo: "ONCE CALDAS"
        },
        "onc/alternativa/red": {
            codigo: "/colors red 40 FFFFFF 171717",
            nombreEquipo: "ONCE CALDAS"
        },
        "onc/alternativa/blue": {
            codigo: "/colors blue 40 FFFFFF 171717",
            nombreEquipo: "ONCE CALDAS"
        },
        "onc/tercera/red": {
            codigo: "/colors red 40 FFFFFF 1C69BB",
            nombreEquipo: "ONCE CALDAS"
        },
        "onc/tercera/blue": {
            codigo: "/colors blue 40 FFFFFF 1C69BB",
            nombreEquipo: "ONCE CALDAS"
        },
    
        // CERRO PORTEÑO
        "ccp/titular/red": {
            codigo: "/colors red 180 FFFFFF E10602 00158C E10602",
            nombreEquipo: "CERRO PORTEÑO"
        },
        "ccp/titular/blue": {
            codigo: "/colors blue 180 FFFFFF E10602 00158C E10602",
            nombreEquipo: "CERRO PORTEÑO"
        },
        "ccp/alternativa/red": {
            codigo: "/colors red 60 1A3E7A FFFFFF",
            nombreEquipo: "CERRO PORTEÑO"
        },
        "ccp/alternativa/blue": {
            codigo: "/colors blue 60 1A3E7A FFFFFF",
            nombreEquipo: "CERRO PORTEÑO"
        },
    
        // OLIMPIA
        "oli/titular/red": {
            codigo: "/colors red 90 A28026 FFFFFF 0D0D0D FFFFFF",
            nombreEquipo: "OLIMPIA"
        },
        "oli/titular/blue": {
            codigo: "/colors blue 90 A28026 FFFFFF 0D0D0D FFFFFF",
            nombreEquipo: "OLIMPIA"
        },
        "oli/alternativa/red": {
            codigo: "/colors red 40 FFFFFF 48424C",
            nombreEquipo: "OLIMPIA"
        },
        "oli/alternativa/blue": {
            codigo: "/colors blue 40 FFFFFF 48424C",
            nombreEquipo: "OLIMPIA"
        },
    
        // GUARANÍ
        "gua/titular/red": {
            codigo: "/colors red 180 FFFFFF FDD537 1C1B16 FDD537",
            nombreEquipo: "GUARANÍ"
        },
        "gua/titular/blue": {
            codigo: "/colors blue 180 FFFFFF FDD537 1C1B16 FDD537",
            nombreEquipo: "GUARANÍ"
        },
        "gua/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 504B48 201F1B 504B48",
            nombreEquipo: "GUARANÍ"
        },
        "gua/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 504B48 201F1B 504B48",
            nombreEquipo: "GUARANÍ"
        },
        // LIBERTAD
        "lib/titular/red": {
            codigo: "/colors red 180 5D636E FFFFFF 16161E FFFFFF",
            nombreEquipo: "LIBERTAD"
        },
        "lib/titular/blue": {
            codigo: "/colors blue 180 5D636E FFFFFF 16161E FFFFFF",
            nombreEquipo: "LIBERTAD"
        },
        "lib/alternativa/red": {
            codigo: "/colors red 40 FFFFFF 171B1E",
            nombreEquipo: "LIBERTAD"
        },
        "lib/alternativa/blue": {
            codigo: "/colors blue 40 FFFFFF 171B1E",
            nombreEquipo: "LIBERTAD"
        },
    
        // SOUTHAMPTON
        "sou/titular/red": {
            codigo: "/colors red 180 191B1F FF0028 FFFFFF FF0028",
            nombreEquipo: "SOUTHAMPTON"
        },
        "sou/titular/blue": {
            codigo: "/colors blue 180 191B1F FF0028 FFFFFF FF0028",
            nombreEquipo: "SOUTHAMPTON"
        },
        "sou/alternativa/red": {
            codigo: "/colors red 90 E2FB40 FDFE4B 283639 283639",
            nombreEquipo: "SOUTHAMPTON"
        },
        "sou/alternativa/blue": {
            codigo: "/colors blue 90 E2FB40 FDFE4B 283639 283639",
            nombreEquipo: "SOUTHAMPTON"
        },
    
        // WATFORD
        "wat/titular/red": {
            codigo: "/colors red 180 F53117 FADF09 161616",
            nombreEquipo: "WATFORD"
        },
        "wat/titular/blue": {
            codigo: "/colors blue 180 F53117 FADF09 161616",
            nombreEquipo: "WATFORD"
        },
    
        // WILLEM II
        "wil/titular/red": {
            codigo: "/colors red 180 0A0A0A 223263 FFFFFF F7014C",
            nombreEquipo: "WILLEM II"
        },
        "wil/titular/blue": {
            codigo: "/colors blue 180 0A0A0A 223263 FFFFFF F7014C",
            nombreEquipo: "WILLEM II"
        },
        "wil/alternativa/red": {
            codigo: "/colors red 180 FFFFFF A42F62 6B436F A42F62",
            nombreEquipo: "WILLEM II"
        },
        "wil/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF A42F62 6B436F A42F62",
            nombreEquipo: "WILLEM II"
        },
        "wil/tercera/red": {
            codigo: "/colors red 90 C09926 C72C27 FFFFFF 0A2245",
            nombreEquipo: "WILLEM II"
        },
        "wil/tercera/blue": {
            codigo: "/colors blue 90 C09926 C72C27 FFFFFF 0A2245",
            nombreEquipo: "WILLEM II"
        },
    
        // ALVARADO
        "alv/titular/red": {
            codigo: "/colors red 44 091021 1E2F55 FFFFFF 1E2F55",
            nombreEquipo: "ALVARADO"
        },
        "alv/titular/blue": {
            codigo: "/colors blue 44 091021 1E2F55 FFFFFF 1E2F55",
            nombreEquipo: "ALVARADO"
        },
        "alv/alternativa/red": {
            codigo: "/colors red 33 091021 FFFFFF 022C77 FFFFFF",
            nombreEquipo: "ALVARADO"
        },
        "alv/alternativa/blue": {
            codigo: "/colors blue 33 091021 FFFFFF 022C77 FFFFFF",
            nombreEquipo: "ALVARADO"
        },
    
        // AGROPECUARIO
        "agr/titular/red": {
            codigo: "/colors red 180 FCFCFC 168C4B BA2C24 168C4B",
            nombreEquipo: "AGROPECUARIO"
        },
        "agr/titular/blue": {
            codigo: "/colors blue 180 FCFCFC 168C4B BA2C24 168C4B",
            nombreEquipo: "AGROPECUARIO"
        },
        "agr/alternativa/red": {
            codigo: "/colors red 180 151515 1C5F3A FFFFFF BA2C24",
            nombreEquipo: "AGROPECUARIO"
        },
        "agr/alternativa/blue": {
            codigo: "/colors blue 180 151515 1C5F3A FFFFFF BA2C24",
            nombreEquipo: "AGROPECUARIO"
        },
    
        // RIVER (UY)
        "riu/titular/red": {
            codigo: "/colors red 360 000000 FFFFFF D20502 FFFFFF",
            nombreEquipo: "RIVER (UY)"
        },
        "riu/titular/blue": {
            codigo: "/colors blue 360 000000 FFFFFF D20502 FFFFFF",
            nombreEquipo: "RIVER (UY)"
        },
        "riu/alternativa/red": {
            codigo: "/colors red 180 FFFFFF FE0002",
            nombreEquipo: "RIVER (UY)"
        },
        "riu/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF FE0002",
            nombreEquipo: "RIVER (UY)"
        },
    
        // GALATASARAY
        "gs/titular/red": {
            codigo: "/colors red 0 FFFFFF FBBA00 AB092E",
            nombreEquipo: "GALATASARAY"
        },
        "gs/titular/blue": {
            codigo: "/colors blue 0 FFFFFF FBBA00 AB092E",
            nombreEquipo: "GALATASARAY"
        },
        "gs/alternativa/red": {
            codigo: "/colors red 180 8D1D1D E3CFB3",
            nombreEquipo: "GALATASARAY"
        },
        "gs/alternativa/blue": {
            codigo: "/colors blue 180 8D1D1D E3CFB3",
            nombreEquipo: "GALATASARAY"
        },
        "gs/tercera/red": {
            codigo: "/colors red 180 AB1D28 C9C5C9",
            nombreEquipo: "GALATASARAY"
        },
        "gs/tercera/blue": {
            codigo: "/colors blue 180 AB1D28 C9C5C9",
            nombreEquipo: "GALATASARAY"
        },
        // FENERBAHCE
        "fb/titular/red": {
            codigo: "/colors red 180 020E1F FFF100 014582 FFF100",
            nombreEquipo: "FENERBAHCE"
        },
        "fb/titular/blue": {
            codigo: "/colors blue 180 020E1F FFF100 014582 FFF100",
            nombreEquipo: "FENERBAHCE"
        },
        "fb/alternativa/red": {
            codigo: "/colors red 180 2F3A67 F4E800",
            nombreEquipo: "FENERBAHCE"
        },
        "fb/alternativa/blue": {
            codigo: "/colors blue 180 2F3A67 F4E800",
            nombreEquipo: "FENERBAHCE"
        },
    
        // BESIKTAS
        "bjk/titular/red": {
            codigo: "/colors red 180 000000 FFFFFF",
            nombreEquipo: "BESIKTAS"
        },
        "bjk/titular/blue": {
            codigo: "/colors blue 180 000000 FFFFFF",
            nombreEquipo: "BESIKTAS"
        },
        "bjk/alternativa/red": {
            codigo: "/colors red 180 000000 FB3333",
            nombreEquipo: "BESIKTAS"
        },
        "bjk/alternativa/blue": {
            codigo: "/colors blue 180 000000 FB3333",
            nombreEquipo: "BESIKTAS"
        },
    
        // AMÉRICA (MX)
        "amc/titular/red": {
            codigo: "/colors red 180 223346 FBF993",
            nombreEquipo: "AMÉRICA (MX)"
        },
        "amc/titular/blue": {
            codigo: "/colors blue 180 223346 FBF993",
            nombreEquipo: "AMÉRICA (MX)"
        },
        "amc/alternativa/red": {
            codigo: "/colors red 180 F2F2F2 1A2C38",
            nombreEquipo: "AMÉRICA (MX)"
        },
        "amc/alternativa/blue": {
            codigo: "/colors blue 180 F2F2F2 1A2C38",
            nombreEquipo: "AMÉRICA (MX)"
        },
    
        // CRUZ AZUL
        "cruz/titular/red": {
            codigo: "/colors red 180 FFFFFF 263D9A",
            nombreEquipo: "CRUZ AZUL"
        },
        "cruz/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 263D9A",
            nombreEquipo: "CRUZ AZUL"
        },
        "cruz/alternativa/red": {
            codigo: "/colors red 180 31357E FFFFFF",
            nombreEquipo: "CRUZ AZUL"
        },
        "cruz/alternativa/blue": {
            codigo: "/colors blue 180 31357E FFFFFF",
            nombreEquipo: "CRUZ AZUL"
        },
    
        // MONTERREY
        "mty/titular/red": {
            codigo: "/colors red 180 7D7E80 23354F FFFFFF 23354F",
            nombreEquipo: "MONTERREY"
        },
        "mty/titular/blue": {
            codigo: "/colors blue 180 7D7E80 23354F FFFFFF 23354F",
            nombreEquipo: "MONTERREY"
        },
    
        // CHIVAS
        "chv/titular/red": {
            codigo: "/colors red 180 052E4E FFFFFF FE3548 FFFFFF",
            nombreEquipo: "CHIVAS"
        },
        "chv/titular/blue": {
            codigo: "/colors blue 180 052E4E FFFFFF FE3548 FFFFFF",
            nombreEquipo: "CHIVAS"
        },
    
        // TIGRES
        "tgs/titular/red": {
            codigo: "/colors red 90 04407A FBC026 017CD9 FBC026",
            nombreEquipo: "TIGRES"
        },
        "tgs/titular/blue": {
            codigo: "/colors blue 90 04407A FBC026 017CD9 FBC026",
            nombreEquipo: "TIGRES"
        },
    
        // LIGA DE QUITO
        "ldu/titular/red": {
            codigo: "/colors red 360 060541 FFFFFF",
            nombreEquipo: "LIGA DE QUITO"
        },
        "ldu/titular/blue": {
            codigo: "/colors blue 360 060541 FFFFFF",
            nombreEquipo: "LIGA DE QUITO"
        },
        "ldu/alternativa/red": {
            codigo: "/colors red 180 D1BF58 D8060E",
            nombreEquipo: "LIGA DE QUITO"
        },
        "ldu/alternativa/blue": {
            codigo: "/colors blue 180 D1BF58 D8060E",
            nombreEquipo: "LIGA DE QUITO"
        },
        "ldu/tercera/red": {
            codigo: "/colors red 180 F53315 111832",
            nombreEquipo: "LIGA DE QUITO"
        },
        "ldu/tercera/blue": {
            codigo: "/colors blue 180 F53315 111832",
            nombreEquipo: "LIGA DE QUITO"
        },
    
        // BARCELONA SC
        "bsc/titular/red": {
            codigo: "/colors red 180 C90613 F9D532",
            nombreEquipo: "BARCELONA SC"
        },
        "bsc/titular/blue": {
            codigo: "/colors blue 180 C90613 F9D532",
            nombreEquipo: "BARCELONA SC"
        },
        "bsc/alternativa/red": {
            codigo: "/colors red 180 FD6600 67020F",
            nombreEquipo: "BARCELONA SC"
        },
        "bsc/alternativa/blue": {
            codigo: "/colors blue 180 FD6600 67020F",
            nombreEquipo: "BARCELONA SC"
        },
    
        // EMELEC
        "eme/titular/red": {
            codigo: "/colors red 148 FFFFFF 025CCC 004390 025CCC",
            nombreEquipo: "EMELEC"
        },
        "eme/titular/blue": {
            codigo: "/colors blue 148 FFFFFF 025CCC 004390 025CCC",
            nombreEquipo: "EMELEC"
        },
        "eme/alternativa/red": {
            codigo: "/colors red 180 0151C2 FFFFFF",
            nombreEquipo: "EMELEC"
        },
        "eme/alternativa/blue": {
            codigo: "/colors blue 180 0151C2 FFFFFF",
            nombreEquipo: "EMELEC"
        },
    
        // INDEPENDIENTE DEL VALLE
        "idv/titular/red": {
            codigo: "/colors red 90 FFFFFF 001638 001638 001638",
            nombreEquipo: "INDEPENDIENTE DEL VALLE"
        },
        "idv/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 001638 001638 001638",
            nombreEquipo: "INDEPENDIENTE DEL VALLE"
        },
        "idv/alternativa/red": {
            codigo: "/colors red 90 FFFFFF EC70AC EC599F E45195",
            nombreEquipo: "INDEPENDIENTE DEL VALLE"
        },
        "idv/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF EC70AC EC599F E45195",
            nombreEquipo: "INDEPENDIENTE DEL VALLE"
        },
        "idv/clasica/red": {
            codigo: "/colors red 180 FFFFFF 012D6B 231F20 012D6B",
            nombreEquipo: "INDEPENDIENTE DEL VALLE"
        },
        "idv/clasica/blue": {
            codigo: "/colors blue 180 FFFFFF 012D6B 231F20 012D6B",
            nombreEquipo: "INDEPENDIENTE DEL VALLE"
        },
    
        // OLYMPIQUE LYON
        "ol/titular/red": {
            codigo: "/colors red 60 113A80 FBFDFC",
            nombreEquipo: "OLYMPIQUE LYON"
        },
        "ol/titular/blue": {
            codigo: "/colors blue 60 113A80 FBFDFC",
            nombreEquipo: "OLYMPIQUE LYON"
        },
        "ol/alternativa/red": {
            codigo: "/colors red 0 E8E9EA 212C52 1D3C7F 212C52",
            nombreEquipo: "OLYMPIQUE LYON"
        },
        "ol/alternativa/blue": {
            codigo: "/colors blue 0 E8E9EA 222C52 1D3C7F 222C52",
            nombreEquipo: "OLYMPIQUE LYON"
        },
    
        // SAN TELMO
        "stel/titular/red": {
            codigo: "/colors red 180 FFFFFF 3CADFE 24364C 3CADFE",
            nombreEquipo: "SAN TELMO"
        },
        "stel/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 3CADFE 24364C 3CADFE",
            nombreEquipo: "SAN TELMO"
        },
        "stel/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 0D2B43 39A2FE FFFFFF",
            nombreEquipo: "SAN TELMO"
        },
        "stel/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 0D2B43 39A2FE FFFFFF",
            nombreEquipo: "SAN TELMO"
        },
    
        // DEPORTIVO MERLO
        "mer/titular/red": {
            codigo: "/colors red 45 666A78 FFFFFF 050C40 FFFFFF",
            nombreEquipo: "DEP. MERLO"
        },
        "mer/titular/blue": {
            codigo: "/colors blue 45 666A78 FFFFFF 050C40 FFFFFF",
            nombreEquipo: "DEP. MERLO"
        },
        "mer/alternativa/red": {
            codigo: "/colors red 45 FFFFFF 050505 04113D 050505",
            nombreEquipo: "DEP. MERLO"
        },
        "mer/alternativa/blue": {
            codigo: "/colors blue 45 FFFFFF 050505 04113D 050505",
            nombreEquipo: "DEP. MERLO"
        },
        "mer/tercera/red": {
            codigo: "/colors red 90 FFFFFF 660B0A",
            nombreEquipo: "DEP. MERLO"
        },
        "mer/tercera/blue": {
            codigo: "/colors blue 90 FFFFFF 660B0A",
            nombreEquipo: "DEP. MERLO"
        },
    
        // ARGENTINO DE QUILMES
        "adq/titular/red": {
            codigo: "/colors red 180 0A0A0A FFFFFF 76C4F0 FFFFFF",
            nombreEquipo: "ARGENTINO DE QUILMES"
        },
        "adq/titular/blue": {
            codigo: "/colors blue 180 0A0A0A FFFFFF 76C4F0 FFFFFF",
            nombreEquipo: "ARGENTINO DE QUILMES"
        },
        "adq/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 777A89 000000 777A89",
            nombreEquipo: "ARGENTINO DE QUILMES"
        },
        "adq/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 777A89 000000 777A89",
            nombreEquipo: "ARGENTINO DE QUILMES"
        },
    
        // VALENCIA
        "val/titular/red": {
            codigo: "/colors red 33 141205 FE7103 F8F7F8 F8F7F8",
            nombreEquipo: "VALENCIA"
        },
        "val/titular/blue": {
            codigo: "/colors blue 33 141205 FE7103 F8F7F8 F8F7F8",
            nombreEquipo: "VALENCIA"
        },
        "val/alternativa/red": {
            codigo: "/colors red 90 FF671E E55C19 161419 161419",
            nombreEquipo: "VALENCIA"
        },
        "val/alternativa/blue": {
            codigo: "/colors blue 90 FF671E E55C19 161419 161419",
            nombreEquipo: "VALENCIA"
        },
        "val/tercera/red": {
            codigo: "/colors red 123 F0FDFE 0C83D5 21BCF4",
            nombreEquipo: "VALENCIA"
        },
        "val/tercera/blue": {
            codigo: "/colors blue 123 F0FDFE 0C83D5 21BCF4",
            nombreEquipo: "VALENCIA"
        },
    
        // REAL BETIS
        "bet/titular/red": {
            codigo: "/colors red 180 000000 2CB764 FFFFFF 2CB764",
            nombreEquipo: "REAL BETIS"
        },
        "bet/titular/blue": {
            codigo: "/colors blue 180 000000 2CB764 FFFFFF 2CB764",
            nombreEquipo: "REAL BETIS"
        },
    
        // CRYSTAL PALACE
        "cry/titular/red": {
            codigo: "/colors red 180 FFFFFF C11930 01449B C11930",
            nombreEquipo: "CRYSTAL PALACE"
        },
        "cry/titular/blue": {
            codigo: "/colors blue 180 FFFFFF C11930 01449B C11930",
            nombreEquipo: "CRYSTAL PALACE"
        },
        "cry/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 242227 01449B 242227",
            nombreEquipo: "CRYSTAL PALACE"
        },
        "cry/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 242227 01449B 242227",
            nombreEquipo: "CRYSTAL PALACE"
        },
        "cry/tercera/red": {
            codigo: "/colors red 45 0731C3 FFFFFF ED1628 FFFFFF",
            nombreEquipo: "CRYSTAL PALACE"
        },
        "cry/tercera/blue": {
            codigo: "/colors blue 45 0731C3 FFFFFF ED1628 FFFFFF",
            nombreEquipo: "CRYSTAL PALACE"
        },
    
        // JUVENTUD ANTONIANA
        "cja/titular/red": {
            codigo: "/colors red 45 8892A6 FFFFFF 304268 FFFFFF",
            nombreEquipo: "JUVENTUD ANTONIANA"
        },
        "cja/titular/blue": {
            codigo: "/colors blue 45 8892A6 FFFFFF 304268 FFFFFF",
            nombreEquipo: "JUVENTUD ANTONIANA"
        },
        "cja/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 17286E 304268 17286E",
            nombreEquipo: "JUVENTUD ANTONIANA"
        },
        "cja/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 17286E 304268 17286E",
            nombreEquipo: "JUVENTUD ANTONIANA"
        },
        "cja/tercera/red": {
            codigo: "/colors red 45 0F1014 113653 FFFFFF 3D2813",
            nombreEquipo: "JUVENTUD ANTONIANA"
        },
        "cja/tercera/blue": {
            codigo: "/colors blue 45 0F1014 113653 FFFFFF 3D2813",
            nombreEquipo: "JUVENTUD ANTONIANA"
        },
    
        // GIMNASIA Y TIRO
        "gyt/titular/red": {
            codigo: "/colors red 180 000000 A8E0F9 FFFFFF A8E0F9",
            nombreEquipo: "GIMNASIA Y TIRO"
        },
        "gyt/titular/blue": {
            codigo: "/colors blue 180 000000 A8E0F9 FFFFFF A8E0F9",
            nombreEquipo: "GIMNASIA Y TIRO"
        },
        "gyt/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 141657 181965 141657",
            nombreEquipo: "GIMNASIA Y TIRO"
        },
        "gyt/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 141657 181965 141657",
            nombreEquipo: "GIMNASIA Y TIRO"
        },
        "gyt/tercera/red": {
            codigo: "/colors red 45 FFFFFF 0A0A0A",
            nombreEquipo: "GIMNASIA Y TIRO"
        },
        "gyt/tercera/blue": {
            codigo: "/colors blue 45 FFFFFF 0A0A0A",
            nombreEquipo: "GIMNASIA Y TIRO"
        },
    
        // PATRONATO
        "pat/titular/red": {
            codigo: "/colors red 180 FFFFFF B20000 0C0C0C B20000",
            nombreEquipo: "PATRONATO"
        },
        "pat/titular/blue": {
            codigo: "/colors blue 180 FFFFFF B20000 0C0C0C B20000",
            nombreEquipo: "PATRONATO"
        },
        "pat/alternativa/red": {
            codigo: "/colors red 180 000000 E8171F FFFFFF FFFFFF",
            nombreEquipo: "PATRONATO"
        },
        "pat/alternativa/blue": {
            codigo: "/colors blue 180 000000 E8171F FFFFFF FFFFFF",
            nombreEquipo: "PATRONATO"
        },
    
        // RAYO VALLECANO
        "ray/titular/red": {
            codigo: "/colors red 28 000000 FFFFFF FF2E29 FFFFFF",
            nombreEquipo: "RAYO VALLECANO"
        },
        "ray/titular/blue": {
            codigo: "/colors blue 28 000000 FFFFFF FF2E29 FFFFFF",
            nombreEquipo: "RAYO VALLECANO"
        },
        "ray/alternativa/red": {
            codigo: "/colors red 28 FFFFFF FE322B 130F10 FE322B",
            nombreEquipo: "RAYO VALLECANO"
        },
        "ray/alternativa/blue": {
            codigo: "/colors blue 28 FFFFFF FE322B 130F10 FE322B",
            nombreEquipo: "RAYO VALLECANO"
        },
        "ray/tercera/red": {
            codigo: "/colors red 28 FFFFFF 130F10 00A4D2 130F10",
            nombreEquipo: "RAYO VALLECANO"
        },
        "ray/tercera/blue": {
            codigo: "/colors blue 28 FFFFFF 130F10 00A4D2 130F10",
            nombreEquipo: "RAYO VALLECANO"
        },
    
        // LEVANTE
        "lev/titular/red": {
            codigo: "/colors red 180 FFFFFF 0A1E97 A60727 0A1E97",
            nombreEquipo: "LEVANTE"
        },
        "lev/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 0A1E97 A60727 0A1E97",
            nombreEquipo: "LEVANTE"
        },
        "lev/alternativa/red": {
            codigo: "/colors red 180 191717 FFFFFF 000DD8 FFFFFF",
            nombreEquipo: "LEVANTE"
        },
        "lev/alternativa/blue": {
            codigo: "/colors blue 180 191717 FFFFFF 000DD8 FFFFFF",
            nombreEquipo: "LEVANTE"
        },
        "lev/tercera/red": {
            codigo: "/colors red 180 191717 E2E2E2",
            nombreEquipo: "LEVANTE"
        },
        "lev/tercera/blue": {
            codigo: "/colors blue 180 191717 E2E2E2",
            nombreEquipo: "LEVANTE"
        },
    
        // GETAFE
        "get/titular/red": {
            codigo: "/colors red 180 FFFFFF 086BD3",
            nombreEquipo: "GETAFE"
        },
        "get/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 086BD3",
            nombreEquipo: "GETAFE"
        },
        "get/alternativa/red": {
            codigo: "/colors red 180 FFFFFF F34C28",
            nombreEquipo: "GETAFE"
        },
        "get/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF F34C28",
            nombreEquipo: "GETAFE"
        },
    
        // ZENIT
        "zen/titular/red": {
            codigo: "/colors red 146 FFFFFF 1BB1E3 0E8BC1 0F649A",
            nombreEquipo: "ZENIT"
        },
        "zen/titular/blue": {
            codigo: "/colors blue 146 FFFFFF 1BB1E3 0E8BC1 0F649A",
            nombreEquipo: "ZENIT"
        },
        "zen/alternativa/red": {
            codigo: "/colors red 180 0099C3 FFFFFF",
            nombreEquipo: "ZENIT"
        },
        "zen/alternativa/blue": {
            codigo: "/colors blue 180 0099C3 FFFFFF",
            nombreEquipo: "ZENIT"
        },
    
        // CSKA MOSCÚ
        "csk/titular/red": {
            codigo: "/colors red 180 FFFFFF FF2039 016AD7 FF2039",
            nombreEquipo: "CSKA MOSCÚ"
        },
        "csk/titular/blue": {
            codigo: "/colors blue 180 FFFFFF FF2039 016AD7 FF2039",
            nombreEquipo: "CSKA MOSCÚ"
        },
        "csk/alternativa/red": {
            codigo: "/colors red 180 024FBB FFFFFF FF2039 FFFFFF",
            nombreEquipo: "CSKA MOSCÚ"
        },
        "csk/alternativa/blue": {
            codigo: "/colors blue 180 024FBB FFFFFF FF2039 FFFFFF",
            nombreEquipo: "CSKA MOSCÚ"
        },
        "csk/tercera/red": {
            codigo: "/colors red 134 082957 FEAC48 FEAC48 01438F",
            nombreEquipo: "CSKA MOSCÚ"
        },
        "csk/tercera/blue": {
            codigo: "/colors blue 134 082957 FEAC48 FEAC48 01438F",
            nombreEquipo: "CSKA MOSCÚ"
        },
    
        // LOKOMOTIV
        "lok/titular/red": {
            codigo: "/colors red 236 FFFFFF 025948 025948 C70B24",
            nombreEquipo: "LOKOMOTIV"
        },
        "lok/titular/blue": {
            codigo: "/colors blue 236 FFFFFF 025948 025948 C70B24",
            nombreEquipo: "LOKOMOTIV"
        },
        "lok/alternativa/red": {
            codigo: "/colors red 90 E71218 026052 FFFFFF FFFFFF",
            nombreEquipo: "LOKOMOTIV"
        },
        "lok/alternativa/blue": {
            codigo: "/colors blue 90 E71218 026052 FFFFFF FFFFFF",
            nombreEquipo: "LOKOMOTIV"
        },
        "lok/tercera/red": {
            codigo: "/colors red 90 E0E2E1 CD090A 525157 525157",
            nombreEquipo: "LOKOMOTIV"
        },
        "lok/tercera/blue": {
            codigo: "/colors blue 90 E0E2E1 CD090A 525157 525157",
            nombreEquipo: "LOKOMOTIV"
        },
        // SPARTAK MOSCÚ
        "spm/titular/red": {
            codigo: "/colors red 90 8A939E D4001D FBFEFD D4001D",
            nombreEquipo: "SPARTAK MOSCÚ"
        },
        "spm/titular/blue": {
            codigo: "/colors blue 90 8A939E D4001D FBFEFD D4001D",
            nombreEquipo: "SPARTAK MOSCÚ"
        },
        "spm/alternativa/red": {
            codigo: "/colors red 90 4F0000 FFFFFF CE1D31 FFFFFF",
            nombreEquipo: "SPARTAK MOSCÚ"
        },
        "spm/alternativa/blue": {
            codigo: "/colors blue 90 4F0000 FFFFFF CE1D31 FFFFFF",
            nombreEquipo: "SPARTAK MOSCÚ"
        },
    
        // DYNAMO MOSCOW
        "din/titular/red": {
            codigo: "/colors red 90 FDFFFE 0066CD",
            nombreEquipo: "DYNAMO MOSCOW"
        },
        "din/titular/blue": {
            codigo: "/colors blue 90 FDFFFE 0066CD",
            nombreEquipo: "DYNAMO MOSCOW"
        },
        "din/alternativa/red": {
            codigo: "/colors red 90 1F71D7 FFFFFF",
            nombreEquipo: "DYNAMO MOSCOW"
        },
        "din/alternativa/blue": {
            codigo: "/colors blue 90 1F71D7 FFFFFF",
            nombreEquipo: "DYNAMO MOSCOW"
        },
    
        // DYNAMO KIEV
        "dyk/titular/red": {
            codigo: "/colors red 90 146DD3 FFFFFF",
            nombreEquipo: "DYNAMO KIEV"
        },
        "dyk/titular/blue": {
            codigo: "/colors blue 90 146DD3 FFFFFF",
            nombreEquipo: "DYNAMO KIEV"
        },
        "dyk/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 0167B2",
            nombreEquipo: "DYNAMO KIEV"
        },
        "dyk/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 0167B2",
            nombreEquipo: "DYNAMO KIEV"
        },
    
        // SHAKHTAR DONETSK
        "sha/titular/red": {
            codigo: "/colors red 1 000000 F39C4D EF3B24",
            nombreEquipo: "SHAKHTAR DONETSK"
        },
        "sha/titular/blue": {
            codigo: "/colors blue 1 000000 F39C4D EF3B24",
            nombreEquipo: "SHAKHTAR DONETSK"
        },
        "sha/alternativa/red": {
            codigo: "/colors red 1 000000 AC9E9B DAD0CF AC9E9B",
            nombreEquipo: "SHAKHTAR DONETSK"
        },
        "sha/alternativa/blue": {
            codigo: "/colors blue 1 000000 AC9E9B DAD0CF AC9E9B",
            nombreEquipo: "SHAKHTAR DONETSK"
        },
    
        // JAPÓN
        "jap/titular/red": {
            codigo: "/colors red 90 F4363B 202531 305797 388BE7",
            nombreEquipo: "JAPÓN"
        },
        "jap/titular/blue": {
            codigo: "/colors blue 90 F4363B 202531 305797 388BE7",
            nombreEquipo: "JAPÓN"
        },
        "jap/alternativa/red": {
            codigo: "/colors red 180 B52024 F7FDFF",
            nombreEquipo: "JAPÓN"
        },
        "jap/alternativa/blue": {
            codigo: "/colors blue 180 B52024 F7FDFF",
            nombreEquipo: "JAPÓN"
        },
    
        // NUEVA ZELANDA
        "nze/titular/red": {
            codigo: "/colors red 33 191E22 FFFFFF",
            nombreEquipo: "NUEVA ZELANDA"
        },
        "nze/titular/blue": {
            codigo: "/colors blue 33 191E22 FFFFFF",
            nombreEquipo: "NUEVA ZELANDA"
        },
        "nze/alternativa/red": {
            codigo: "/colors red 240 F5F5F5 232323 232323 2E2F33",
            nombreEquipo: "NUEVA ZELANDA"
        },
        "nze/alternativa/blue": {
            codigo: "/colors blue 240 F5F5F5 232323 232323 2E2F33",
            nombreEquipo: "NUEVA ZELANDA"
        },
    
        // COREA DEL NORTE
        "cno/titular/red": {
            codigo: "/colors red 33 FFFFFF FF0000",
            nombreEquipo: "COREA DEL NORTE"
        },
        "cno/titular/blue": {
            codigo: "/colors blue 33 FFFFFF FF0000",
            nombreEquipo: "COREA DEL NORTE"
        },
        "cno/alternativa/red": {
            codigo: "/colors red 240 FF0000 F5F9FF",
            nombreEquipo: "COREA DEL NORTE"
        },
        "cno/alternativa/blue": {
            codigo: "/colors blue 240 FF0000 F5F9FF",
            nombreEquipo: "COREA DEL NORTE"
        },
        "cno/bandera/red": {
            codigo: "/colors red 90 FFFFFF 024FA2 ED1C27 024FA2",
            nombreEquipo: "COREA DEL NORTE"
        },
        "cno/bandera/blue": {
            codigo: "/colors blue 90 FFFFFF 024FA2 ED1C27 024FA2",
            nombreEquipo: "COREA DEL NORTE"
        },
    
        // AUSTRIA
        "aut/titular/red": {
            codigo: "/colors red 33 FFFFFF D80B2A",
            nombreEquipo: "AUSTRIA"
        },
        "aut/titular/blue": {
            codigo: "/colors blue 33 FFFFFF D80B2A",
            nombreEquipo: "AUSTRIA"
        },
        "aut/alternativa/red": {
            codigo: "/colors red 240 000000 FFFFFF",
            nombreEquipo: "AUSTRIA"
        },
        "aut/alternativa/blue": {
            codigo: "/colors blue 240 000000 FFFFFF",
            nombreEquipo: "AUSTRIA"
        },
        "aut/bandera/red": {
            codigo: "/colors red 90 000000 ED2939 FFFFFF ED2939",
            nombreEquipo: "AUSTRIA"
        },
        "aut/bandera/blue": {
            codigo: "/colors blue 90 000000 ED2939 FFFFFF ED2939",
            nombreEquipo: "AUSTRIA"
        },
    
        // ATLANTA UNITED
        "atlu/titular/red": {
            codigo: "/colors red 180 C2B28E 222021 C70C41 222021",
            nombreEquipo: "ATLANTA UNITED"
        },
        "atlu/titular/blue": {
            codigo: "/colors blue 180 C2B28E 222021 C70C41 222021",
            nombreEquipo: "ATLANTA UNITED"
        },
        "atlu/alternativa/red": {
            codigo: "/colors red 240 FF774D E1E5E6",
            nombreEquipo: "ATLANTA UNITED"
        },
        "atlu/alternativa/blue": {
            codigo: "/colors blue 240 FF774D E1E5E6",
            nombreEquipo: "ATLANTA UNITED"
        },
    
        // LA GALAXY
        "la/titular/red": {
            codigo: "/colors red 35 FDC904 FFFFFF 232941 FFFFFF",
            nombreEquipo: "LA GALAXY"
        },
        "la/titular/blue": {
            codigo: "/colors blue 35 FDC904 FFFFFF 232941 FFFFFF",
            nombreEquipo: "LA GALAXY"
        },
        "la/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 294A73 1E2037 294A73",
            nombreEquipo: "LA GALAXY"
        },
        "la/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 294A73 1E2037 294A73",
            nombreEquipo: "LA GALAXY"
        },
    
        // TORONTO FC
        "tofc/titular/red": {
            codigo: "/colors red 33 FFFFFF E50126",
            nombreEquipo: "TORONTO FC"
        },
        "tofc/titular/blue": {
            codigo: "/colors blue 33 FFFFFF E50126",
            nombreEquipo: "TORONTO FC"
        },
        "tofc/alternativa/red": {
            codigo: "/colors red 240 1D1C21 E6EBEF",
            nombreEquipo: "TORONTO FC"
        },
        "tofc/alternativa/blue": {
            codigo: "/colors blue 240 1D1C21 E6EBEF",
            nombreEquipo: "TORONTO FC"
        },
    
        // NEW YORK CITY
        "nyc/titular/red": {
            codigo: "/colors red 33 102A5B 82BCEC",
            nombreEquipo: "NEW YORK CITY"
        },
        "nyc/titular/blue": {
            codigo: "/colors blue 33 102A5B 82BCEC",
            nombreEquipo: "NEW YORK CITY"
        },
        "nyc/alternativa/red": {
            codigo: "/colors red 240 7CBEEA 4D5361",
            nombreEquipo: "NEW YORK CITY"
        },
        "nyc/alternativa/blue": {
            codigo: "/colors blue 240 7CBEEA 4D5361",
            nombreEquipo: "NEW YORK CITY"
        },
        // LOS ANGELES FC
        "lafc/titular/red": {
            codigo: "/colors red 33 CBAD6F 322E2B",
            nombreEquipo: "LOS ANGELES FC"
        },
        "lafc/titular/blue": {
            codigo: "/colors blue 33 CBAD6F 322E2B",
            nombreEquipo: "LOS ANGELES FC"
        },
        "lafc/alternativa/red": {
            codigo: "/colors red 240 AEAFB1 EFEEF3",
            nombreEquipo: "LOS ANGELES FC"
        },
        "lafc/alternativa/blue": {
            codigo: "/colors blue 240 AEAFB1 EFEEF3",
            nombreEquipo: "LOS ANGELES FC"
        },
    
        // SEATTLE SOUNDERS
        "sea/titular/red": {
            codigo: "/colors red 33 FFFFFF 98C067",
            nombreEquipo: "SEATTLE SOUNDERS"
        },
        "sea/titular/blue": {
            codigo: "/colors blue 33 FFFFFF 98C067",
            nombreEquipo: "SEATTLE SOUNDERS"
        },
        "sea/alternativa/red": {
            codigo: "/colors red 240 FFFFFF 2C2A2F 2C2A2F E18298",
            nombreEquipo: "SEATTLE SOUNDERS"
        },
        "sea/alternativa/blue": {
            codigo: "/colors blue 240 FFFFFF 2C2A2F 2C2A2F E18298",
            nombreEquipo: "SEATTLE SOUNDERS"
        },
    
        // NEW YORK RED BULL
        "nyrb/titular/red": {
            codigo: "/colors red 33 8C0C2D D0D0D2",
            nombreEquipo: "NEW YORK RB"
        },
        "nyrb/titular/blue": {
            codigo: "/colors blue 33 8C0C2D D0D0D2",
            nombreEquipo: "NEW YORK RB"
        },
        "nyrb/alternativa/red": {
            codigo: "/colors red 240 FFFFFF F1273D",
            nombreEquipo: "NEW YORK RB"
        },
        "nyrb/alternativa/blue": {
            codigo: "/colors blue 240 FFFFFF F1273D",
            nombreEquipo: "NEW YORK RB"
        },
    
        // PORTLAND TIMBERS
        "ptim/titular/red": {
            codigo: "/colors red 90 DFB231 293728 31492F 293728",
            nombreEquipo: "PORTLAND TIMBERS"
        },
        "ptim/titular/blue": {
            codigo: "/colors blue 90 DFB231 293728 31492F 293728",
            nombreEquipo: "PORTLAND TIMBERS"
        },
        "ptim/alternativa/red": {
            codigo: "/colors red 240 486551 FFFFFF",
            nombreEquipo: "PORTLAND TIMBERS"
        },
        "ptim/alternativa/blue": {
            codigo: "/colors blue 240 486551 FFFFFF",
            nombreEquipo: "PORTLAND TIMBERS"
        },
    
        // COLO COLO
        "cco/titular/red": {
            codigo: "/colors red 33 000000 F6F6F7",
            nombreEquipo: "COLO COLO"
        },
        "cco/titular/blue": {
            codigo: "/colors blue 33 000000 F6F6F7",
            nombreEquipo: "COLO COLO"
        },
        "cco/alternativa/red": {
            codigo: "/colors red 240 CFCFCF 212223 212223 FFFFFF",
            nombreEquipo: "COLO COLO"
        },
        "cco/alternativa/blue": {
            codigo: "/colors blue 240 CFCFCF 212223 212223 FFFFFF",
            nombreEquipo: "COLO COLO"
        },
    
        // U DE CHILE
        "udc/titular/red": {
            codigo: "/colors red 33 F4F4F4 1C2445",
            nombreEquipo: "U DE CHILE"
        },
        "udc/titular/blue": {
            codigo: "/colors blue 33 F4F4F4 1C2445",
            nombreEquipo: "U DE CHILE"
        },
        "udc/alternativa/red": {
            codigo: "/colors red 90 F7F7F7 F33134 611C1C F33134",
            nombreEquipo: "U DE CHILE"
        },
        "udc/alternativa/blue": {
            codigo: "/colors blue 90 F7F7F7 F33134 611C1C F33134",
            nombreEquipo: "U DE CHILE"
        },
    
        // STRONGEST
        "stg/titular/red": {
            codigo: "/colors red 180 FFFFFF FECE2D 1D1B1E FECE2D",
            nombreEquipo: "STRONGEST"
        },
        "stg/titular/blue": {
            codigo: "/colors blue 180 FFFFFF FECE2D 1D1B1E FECE2D",
            nombreEquipo: "STRONGEST"
        },
        "stg/alternativa/red": {
            codigo: "/colors red 180 030303 FFFFFF EDAE00 FFFFFF",
            nombreEquipo: "STRONGEST"
        },
        "stg/alternativa/blue": {
            codigo: "/colors blue 180 030303 FFFFFF EDAE00 FFFFFF",
            nombreEquipo: "STRONGEST"
        },
    
        // WILSTERMANN
        "wtm/titular/red": {
            codigo: "/colors red 33 FFFFFF ED1E3C",
            nombreEquipo: "WILSTERMANN"
        },
        "wtm/titular/blue": {
            codigo: "/colors blue 33 FFFFFF ED1E3C",
            nombreEquipo: "WILSTERMANN"
        },
        "wtm/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 1F3E70 16304C 1F3E70",
            nombreEquipo: "WILSTERMANN"
        },
        "wtm/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 1F3E70 16304C 1F3E70",
            nombreEquipo: "WILSTERMANN"
        },
    
        // BOLIVAR
        "blv/titular/red": {
            codigo: "/colors red 33 21406B 92E2FF",
            nombreEquipo: "BOLIVAR"
        },
        "blv/titular/blue": {
            codigo: "/colors blue 33 21406B 92E2FF",
            nombreEquipo: "BOLIVAR"
        },
        "blv/alternativa/red": {
            codigo: "/colors red 180 D8DDEE 333B45",
            nombreEquipo: "BOLIVAR"
        },
        "blv/alternativa/blue": {
            codigo: "/colors blue 180 D8DDEE 333B45",
            nombreEquipo: "BOLIVAR"
        },
    
        // EVERTON FC
        "eve/titular/red": {
            codigo: "/colors red 180 F9F9F9 15428A",
            nombreEquipo: "EVERTON FC"
        },
        "eve/titular/blue": {
            codigo: "/colors blue 180 F9F9F9 15428A",
            nombreEquipo: "EVERTON FC"
        },
        "eve/alternativa/red": {
            codigo: "/colors red 180 0C1448 FA6754",
            nombreEquipo: "EVERTON FC"
        },
        "eve/alternativa/blue": {
            codigo: "/colors blue 180 0C1448 FA6754",
            nombreEquipo: "EVERTON FC"
        },
    
        // AS MONACO
        "asm/titular/red": {
            codigo: "/colors red 61 FEB60A B8242E AD232E FEFEFE",
            nombreEquipo: "AS MONACO"
        },
        "asm/titular/blue": {
            codigo: "/colors blue 61 FEB60A B8242E AD232E FEFEFE",
            nombreEquipo: "AS MONACO"
        },
        "asm/alternativa/red": {
            codigo: "/colors red 180 D5A651 1F2023",
            nombreEquipo: "AS MONACO"
        },
        "asm/alternativa/blue": {
            codigo: "/colors blue 180 D5A651 1F2023",
            nombreEquipo: "AS MONACO"
        },
        "asm/tercera/red": {
            codigo: "/colors red 180 255E9A 93D9F5",
            nombreEquipo: "AS MONACO"
        },
        "asm/tercera/blue": {
            codigo: "/colors blue 180 255E9A 93D9F5",
            nombreEquipo: "AS MONACO"
        },
        // ATALANTA
        "ata/titular/red": {
            codigo: "/colors red 180 FFFFFF 0269B8 251E25 0269B8",
            nombreEquipo: "ATALANTA"
        },
        "ata/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 0269B8 251E25 0269B8",
            nombreEquipo: "ATALANTA"
        },
        "ata/alternativa/red": {
            codigo: "/colors red 90 357FFF 2F71E2 181818 FFFFFF",
            nombreEquipo: "ATALANTA"
        },
        "ata/alternativa/blue": {
            codigo: "/colors blue 90 357FFF 2F71E2 181818 FFFFFF",
            nombreEquipo: "ATALANTA"
        },
        "ata/tercera/red": {
            codigo: "/colors red 0 FFFFFF 874834",
            nombreEquipo: "ATALANTA"
        },
        "ata/tercera/blue": {
            codigo: "/colors blue 0 FFFFFF 874834",
            nombreEquipo: "ATALANTA"
        },
    
        // FC BASEL
        "bas/titular/red": {
            codigo: "/colors red 180 FFFFFF BC051F BC051F 1B3F86",
            nombreEquipo: "FC BASEL"
        },
        "bas/titular/blue": {
            codigo: "/colors blue 180 FFFFFF BC051F BC051F 1B3F86",
            nombreEquipo: "FC BASEL"
        },
        "bas/alternativa/red": {
            codigo: "/colors red 0 1A1A1A E1E1E1",
            nombreEquipo: "FC BASEL"
        },
        "bas/alternativa/blue": {
            codigo: "/colors blue 0 1A1A1A E1E1E1",
            nombreEquipo: "FC BASEL"
        },
        "bas/tercera/red": {
            codigo: "/colors red 0 FFFFFF 222222",
            nombreEquipo: "FC BASEL"
        },
        "bas/tercera/blue": {
            codigo: "/colors blue 0 FFFFFF 222222",
            nombreEquipo: "FC BASEL"
        },
        "bas/clasica/red": {
            codigo: "/colors red 0 FFE500 E40327 0E3B85",
            nombreEquipo: "FC BASEL"
        },
        "bas/clasica/blue": {
            codigo: "/colors blue 0 FFE500 E40327 0E3B85",
            nombreEquipo: "FC BASEL"
        },
    
        // U CATÓLICA
        "uca/titular/red": {
            codigo: "/colors red 90 FE0000 FFFFFF 2148A0 FFFFFF",
            nombreEquipo: "U CATÓLICA"
        },
        "uca/titular/blue": {
            codigo: "/colors blue 90 FE0000 FFFFFF 2148A0 FFFFFF",
            nombreEquipo: "U CATÓLICA"
        },
        "uca/alternativa/red": {
            codigo: "/colors red 60 FFFFFF D22F1E",
            nombreEquipo: "U CATÓLICA"
        },
        "uca/alternativa/blue": {
            codigo: "/colors blue 60 FFFFFF D22F1E",
            nombreEquipo: "U CATÓLICA"
        },
        "uca/tercera/red": {
            codigo: "/colors red 90 FF0000 2148A0 FFFFFF 2148A0",
            nombreEquipo: "U CATÓLICA"
        },
        "uca/tercera/blue": {
            codigo: "/colors blue 90 FF0000 2148A0 FFFFFF 2148A0",
            nombreEquipo: "U CATÓLICA"
        },
    
        // COBRELOA
        "cob/titular/red": {
            codigo: "/colors red 30 FFFFFF FF4B15 CC3900",
            nombreEquipo: "COBRELOA"
        },
        "cob/titular/blue": {
            codigo: "/colors blue 30 FFFFFF FF4B15 CC3900",
            nombreEquipo: "COBRELOA"
        },
        "cob/alternativa/red": {
            codigo: "/colors red 30 000000 FFFFFF CFCFCF",
            nombreEquipo: "COBRELOA"
        },
        "cob/alternativa/blue": {
            codigo: "/colors blue 30 000000 FFFFFF CFCFCF",
            nombreEquipo: "COBRELOA"
        },
        "cob/tercera/red": {
            codigo: "/colors red 30 FFFFFF 45485B 1A1A1A",
            nombreEquipo: "COBRELOA"
        },
        "cob/tercera/blue": {
            codigo: "/colors blue 30 FFFFFF 45485B 1A1A1A",
            nombreEquipo: "COBRELOA"
        },
    
        // PALESTINO
        "cdp/titular/red": {
            codigo: "/colors red 0 000000 FFFFFF 047B4E E30000",
            nombreEquipo: "PALESTINO"
        },
        "cdp/titular/blue": {
            codigo: "/colors blue 0 000000 FFFFFF 047B4E E30000",
            nombreEquipo: "PALESTINO"
        },
        "cdp/alternativa/red": {
            codigo: "/colors red 0 FAFAFA E30000 000503 047B4E",
            nombreEquipo: "PALESTINO"
        },
        "cdp/alternativa/blue": {
            codigo: "/colors blue 0 FAFAFA E30000 000503 047B4E",
            nombreEquipo: "PALESTINO"
        },
    
        // MELGAR
        "mel/titular/red": {
            codigo: "/colors red 0 FFFFFF EC1B30 2A2A2A",
            nombreEquipo: "MELGAR"
        },
        "mel/titular/blue": {
            codigo: "/colors blue 0 FFFFFF EC1B30 2A2A2A",
            nombreEquipo: "MELGAR"
        },
        "mel/alternativa/red": {
            codigo: "/colors red 0 2A2A2A ECEFF4 EC1B31 ECEFF4",
            nombreEquipo: "MELGAR"
        },
        "mel/alternativa/blue": {
            codigo: "/colors blue 0 2A2A2A ECEFF4 EC1B31 ECEFF4",
            nombreEquipo: "MELGAR"
        },
    
        // UNIVERSITARIO
        "unv/titular/red": {
            codigo: "/colors red 0 812124 E1DCC5",
            nombreEquipo: "UNIVERSITARIO"
        },
        "unv/titular/blue": {
            codigo: "/colors blue 0 812124 E1DCC5",
            nombreEquipo: "UNIVERSITARIO"
        },
        "unv/alternativa/red": {
            codigo: "/colors red 0 FFFFFF 902C38",
            nombreEquipo: "UNIVERSITARIO"
        },
        "unv/alternativa/blue": {
            codigo: "/colors blue 0 FFFFFF 902C38",
            nombreEquipo: "UNIVERSITARIO"
        },
    
        // ALIANZA LIMA
        "ali/titular/red": {
            codigo: "/colors red 180 D9030F 062247 FFFFFF 062247",
            nombreEquipo: "ALIANZA LIMA"
        },
        "ali/titular/blue": {
            codigo: "/colors blue 180 D9030F 062247 FFFFFF 062247",
            nombreEquipo: "ALIANZA LIMA"
        },
        "ali/alternativa/red": {
            codigo: "/colors red 40 F4F4F4 1A2639 253143 253143",
            nombreEquipo: "ALIANZA LIMA"
        },
        "ali/alternativa/blue": {
            codigo: "/colors blue 40 F4F4F4 1A2639 253143 253143",
            nombreEquipo: "ALIANZA LIMA"
        },
    
        // SPORTING CRISTAL
        "cri/titular/red": {
            codigo: "/colors red 0 032543 61C5ED",
            nombreEquipo: "SPORTING CRISTAL"
        },
        "cri/titular/blue": {
            codigo: "/colors blue 0 032543 61C5ED",
            nombreEquipo: "SPORTING CRISTAL"
        },
        "cri/alternativa/red": {
            codigo: "/colors red -90 FFFFFF 212C4B 334A7F",
            nombreEquipo: "SPORTING CRISTAL"
        },
        "cri/alternativa/blue": {
            codigo: "/colors blue -90 FFFFFF 212C4B 334A7F",
            nombreEquipo: "SPORTING CRISTAL"
        },
        "cri/tercera/red": {
            codigo: "/colors red 41 1C1C1C FFFFFF 3CBEEF FFFFFF",
            nombreEquipo: "SPORTING CRISTAL"
        },
        "cri/tercera/blue": {
            codigo: "/colors blue 41 1C1C1C FFFFFF 3CBEEF FFFFFF",
            nombreEquipo: "SPORTING CRISTAL"
        },
        // RUSIA
        "rus/titular/red": {
            codigo: "/colors red 90 FFFFFF C4021D C4323F D43941",
            nombreEquipo: "RUSIA"
        },
        "rus/titular/blue": {
            codigo: "/colors blue 90 FFFFFF C4021D C4323F D43941",
            nombreEquipo: "RUSIA"
        },
        "rus/alternativa/red": {
            codigo: "/colors red -90 114577 EFEFF0",
            nombreEquipo: "RUSIA"
        },
        "rus/alternativa/blue": {
            codigo: "/colors blue -90 114577 EFEFF0",
            nombreEquipo: "RUSIA"
        },
        "rus/bandera/red": {
            codigo: "/colors red 90 DECC57 FFFFFF 0039A6 D52B1E",
            nombreEquipo: "RUSIA"
        },
        "rus/bandera/blue": {
            codigo: "/colors blue 90 DECC57 FFFFFF 0039A6 D52B1E",
            nombreEquipo: "RUSIA"
        },
    
        // ESTADOS UNIDOS
        "usa/titular/red": {
            codigo: "/colors red 122 005588 FFFFFF FFFFFF B30119",
            nombreEquipo: "EEUU"
        },
        "usa/titular/blue": {
            codigo: "/colors blue 122 005588 FFFFFF FFFFFF B30119",
            nombreEquipo: "EEUU"
        },
        "usa/alternativa/red": {
            codigo: "/colors red -122 F2F4F5 E30212 273D87 273D87",
            nombreEquipo: "EEUU"
        },
        "usa/alternativa/blue": {
            codigo: "/colors blue -122 F2F4F5 E30212 273D87 273D87",
            nombreEquipo: "EEUU"
        },
        "usa/tercera/red": {
            codigo: "/colors red -90 FBFBFA 013354",
            nombreEquipo: "EEUU"
        },
        "usa/tercera/blue": {
            codigo: "/colors blue -90 FBFBFA 013354",
            nombreEquipo: "EEUU"
        },
        "usa/clasica/red": {
            codigo: "/colors red -90 101085 FF2E2E FFFFFF 1C59FF",
            nombreEquipo: "EEUU"
        },
        "usa/clasica/blue": {
            codigo: "/colors blue -90 101085 FF2E2E FFFFFF 1C59FF",
            nombreEquipo: "EEUU"
        },
    
        // ALMAGRO
        "alm/titular/red": {
            codigo: "/colors red 0 FFFFFF 0137D5 18181A 0137D5",
            nombreEquipo: "ALMAGRO"
        },
        "alm/titular/blue": {
            codigo: "/colors blue 0 FFFFFF 0137D5 18181A 0137D5",
            nombreEquipo: "ALMAGRO"
        },
        "alm/alternativa/red": {
            codigo: "/colors red 90 1783FF 003CDB 1F1F21 FDFDFD",
            nombreEquipo: "ALMAGRO"
        },
        "alm/alternativa/blue": {
            codigo: "/colors blue 90 1783FF 003CDB 1F1F21 FDFDFD",
            nombreEquipo: "ALMAGRO"
        },
    
        // NIGERIA
        "nga/titular/red": {
            codigo: "/colors red 180 000000 1D633C F7FAF7 1D633C",
            nombreEquipo: "NIGERIA"
        },
        "nga/titular/blue": {
            codigo: "/colors blue 180 000000 1D633C F7FAF7 1D633C",
            nombreEquipo: "NIGERIA"
        },
        "nga/alternativa/red": {
            codigo: "/colors red -90 FFFFFF 294040",
            nombreEquipo: "NIGERIA"
        },
        "nga/alternativa/blue": {
            codigo: "/colors blue -90 FFFFFF 294040",
            nombreEquipo: "NIGERIA"
        },
    
        // ECUADOR
        "ecu/titular/red": {
            codigo: "/colors red 90 1E2A52 042A95 EBD301 EBD301",
            nombreEquipo: "ECUADOR"
        },
        "ecu/titular/blue": {
            codigo: "/colors blue 90 1E2A52 042A95 EBD301 EBD301",
            nombreEquipo: "ECUADOR"
        },
        "ecu/alternativa/red": {
            codigo: "/colors red 90 EDFE2D 777B6E",
            nombreEquipo: "ECUADOR"
        },
        "ecu/alternativa/blue": {
            codigo: "/colors blue 90 EDFE2D 777B6E",
            nombreEquipo: "ECUADOR"
        },
    
        // CADU
        "cadu/titular/red": {
            codigo: "/colors red 180 0F0F0F 0A94DC 2CCAF8 0A94DC",
            nombreEquipo: "CADU"
        },
        "cadu/titular/blue": {
            codigo: "/colors blue 180 0F0F0F 0A94DC 2CCAF8 0A94DC",
            nombreEquipo: "CADU"
        },
        "cadu/alternativa/red": {
            codigo: "/colors red 135 007EFC FFFFFF 47C4FB FFFFFF",
            nombreEquipo: "CADU"
        },
        "cadu/alternativa/blue": {
            codigo: "/colors blue 135 007EFC FFFFFF 47C4FB FFFFFF",
            nombreEquipo: "CADU"
        },
    
        // URSS
        "urss/titular/red": {
            codigo: "/colors red 90 FFFFFF B00819",
            nombreEquipo: "URSS"
        },
        "urss/titular/blue": {
            codigo: "/colors blue 90 FFFFFF B00819",
            nombreEquipo: "URSS"
        },
        "urss/alternativa/red": {
            codigo: "/colors red 90 AB0818 FAFAFA",
            nombreEquipo: "URSS"
        },
        "urss/alternativa/blue": {
            codigo: "/colors blue 90 AB0818 FAFAFA",
            nombreEquipo: "URSS"
        },
    
        // YUGOSLAVIA
        "yug/titular/red/1990": {
            codigo: "/colors red 153 FFFFFF 0F4BA1 0F4BA1 DE0000",
            nombreEquipo: "YUGOSLAVIA"
        },
        "yug/titular/blue/1990": {
            codigo: "/colors blue 153 FFFFFF 0F4BA1 0F4BA1 DE0000",
            nombreEquipo: "YUGOSLAVIA"
        },
        "yug/alternativa/red/1990": {
            codigo: "/colors red 153 0D4BB2 FFFFFF FFFFFF DD251D",
            nombreEquipo: "YUGOSLAVIA"
        },
        "yug/alternativa/blue/1990": {
            codigo: "/colors blue 153 0D4BB2 FFFFFF FFFFFF DD251D",
            nombreEquipo: "YUGOSLAVIA"
        },
        "yug/titular/red/1984": {
            codigo: "/colors red 90 FFFFFF 18529D",
            nombreEquipo: "YUGOSLAVIA"
        },
        "yug/titular/blue/1984": {
            codigo: "/colors blue 90 FFFFFF 18529D",
            nombreEquipo: "YUGOSLAVIA"
        },
        "yug/alternativa/red/1984": {
            codigo: "/colors red 90 00388E FFFFFF",
            nombreEquipo: "YUGOSLAVIA"
        },
        "yug/alternativa/blue/1984": {
            codigo: "/colors blue 90 00388E FFFFFF",
            nombreEquipo: "YUGOSLAVIA"
        },
        "yug/bandera/red": {
            codigo: "/colors red 90 DE0000 003893 FFFFFF DE0000",
            nombreEquipo: "YUGOSLAVIA"
        },
        "yug/bandera/blue": {
            codigo: "/colors blue 90 DE0000 003893 FFFFFF DE0000",
            nombreEquipo: "YUGOSLAVIA"
        },
    
        // ALUMNI
        "alu/titular/red": {
            codigo: "/colors red 180 000000 FF0000 FFFFFF FF0000",
            nombreEquipo: "ALUMNI"
        },
        "alu/titular/blue": {
            codigo: "/colors blue 180 000000 FF0000 FFFFFF FF0000",
            nombreEquipo: "ALUMNI"
        },
        "alu/alternativa/red": {
            codigo: "/colors red 90 000000 E30F10 FFFFFF E30F10",
            nombreEquipo: "ALUMNI"
        },
        "alu/alternativa/blue": {
            codigo: "/colors blue 90 000000 E30F10 FFFFFF E30F10",
            nombreEquipo: "ALUMNI"
        },
    
        // VILLA SAN CARLOS
        "vsc/titular/red": {
            codigo: "/colors red 42 131B2A 48B8E5 FFFFFF 48B8E5",
            nombreEquipo: "VILLA SAN CARLOS"
        },
        "vsc/titular/blue": {
            codigo: "/colors blue 42 131B2A 48B8E5 FFFFFF 48B8E5",
            nombreEquipo: "VILLA SAN CARLOS"
        },
        "vsc/alternativa/red": {
            codigo: "/colors red 56 F0F0F0 01C8FF 292C34 292C34",
            nombreEquipo: "VILLA SAN CARLOS"
        },
        "vsc/alternativa/blue": {
            codigo: "/colors blue 56 F0F0F0 01C8FF 292C34 292C34",
            nombreEquipo: "VILLA SAN CARLOS"
        },
    
        // LOMAS ATHLETIC
        "loa/titular/red": {
            codigo: "/colors red 180 F5DC00 336633 D90000 336633",
            nombreEquipo: "LOMAS ATHLETIC"
        },
        "loa/titular/blue": {
            codigo: "/colors blue 180 F5DC00 336633 D90000 336633",
            nombreEquipo: "LOMAS ATHLETIC"
        },
        "loa/escudo/red": {
            codigo: "/colors red 180 FCC916 015440 DD191A 015440",
            nombreEquipo: "LOMAS ATHLETIC"
        },
        "loa/escudo/blue": {
            codigo: "/colors blue 180 FCC916 015440 DD191A 015440",
            nombreEquipo: "LOMAS ATHLETIC"
        },
    
        // CHECOSLOVAQUIA
        "cze/titular/red": {
            codigo: "/colors red 180 FFFFFF BE2620",
            nombreEquipo: "CHECOSLOVAQUIA"
        },
        "cze/titular/blue": {
            codigo: "/colors blue 180 FFFFFF BE2620",
            nombreEquipo: "CHECOSLOVAQUIA"
        },
        "cze/alternativa/red": {
            codigo: "/colors red 180 AC1013 FFFFFF",
            nombreEquipo: "CHECOSLOVAQUIA"
        },
        "cze/alternativa/blue": {
            codigo: "/colors blue 180 AC1013 FFFFFF",
            nombreEquipo: "CHECOSLOVAQUIA"
        },
    
        // FC NANTES
        "fcn/titular/red": {
            codigo: "/colors red 180 007037 FEE030 1AAD67 FEE030",
            nombreEquipo: "FC NANTES"
        },
        "fcn/titular/blue": {
            codigo: "/colors blue 180 007037 FEE030 1AAD67 FEE030",
            nombreEquipo: "FC NANTES"
        },
        "fcn/alternativa/red": {
            codigo: "/colors red 60 FFFF00 228B67 167554 167554",
            nombreEquipo: "FC NANTES"
        },
        "fcn/alternativa/blue": {
            codigo: "/colors blue 60 FFFF00 228B67 167554 167554",
            nombreEquipo: "FC NANTES"
        },
        // SAINT ETIENNE
        "ste/titular/red": {
            codigo: "/colors red 90 FFFFFF 0F6B46 1B9365 1B9365",
            nombreEquipo: "SAINT ETIENNE"
        },
        "ste/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 0F6B46 1B9365 1B9365",
            nombreEquipo: "SAINT ETIENNE"
        },
        "ste/alternativa/red": {
            codigo: "/colors red 90 4C6E5D 147858 FFFFFF FFFFFF",
            nombreEquipo: "SAINT ETIENNE"
        },
        "ste/alternativa/blue": {
            codigo: "/colors blue 90 4C6E5D 147858 FFFFFF FFFFFF",
            nombreEquipo: "SAINT ETIENNE"
        },
        "ste/tercera/red": {
            codigo: "/colors red 90 FFFFFF 727085 8E909D 8E909D",
            nombreEquipo: "SAINT ETIENNE"
        },
        "ste/tercera/blue": {
            codigo: "/colors blue 90 FFFFFF 727085 8E909D 8E909D",
            nombreEquipo: "SAINT ETIENNE"
        },
    
        // RENNES
        "ren/titular/red": {
            codigo: "/colors red 180 F0F0F0 000000 DC0D15",
            nombreEquipo: "RENNES"
        },
        "ren/titular/blue": {
            codigo: "/colors blue 180 F0F0F0 000000 DC0D15",
            nombreEquipo: "RENNES"
        },
        "ren/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 276DD6 1B50B5 276DD6",
            nombreEquipo: "RENNES"
        },
        "ren/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 276DD6 1B50B5 276DD6",
            nombreEquipo: "RENNES"
        },
        "ren/tercera/red": {
            codigo: "/colors red 180 000000 FFDF00",
            nombreEquipo: "RENNES"
        },
        "ren/tercera/blue": {
            codigo: "/colors blue 180 000000 FFDF00",
            nombreEquipo: "RENNES"
        },
    
        // FC NYVA VINNYTSIA
        "nyv/titular/red": {
            codigo: "/colors red 180 FFFFFF 42A161",
            nombreEquipo: "FC NYVA VINNYTSIA"
        },
        "nyv/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 42A161",
            nombreEquipo: "FC NYVA VINNYTSIA"
        },
        "nyv/alternativa/red": {
            codigo: "/colors red 90 439B73 3AA070 FFFFFF FFFFFF",
            nombreEquipo: "FC NYVA VINNYTSIA"
        },
        "nyv/alternativa/blue": {
            codigo: "/colors blue 90 439B73 3AA070 FFFFFF FFFFFF",
            nombreEquipo: "FC NYVA VINNYTSIA"
        },
    
        // ORLANDO CITY
        "orl/titular/red": {
            codigo: "/colors red 70 FFFFFF 3F0B74 360963 360963",
            nombreEquipo: "ORLANDO CITY"
        },
        "orl/titular/blue": {
            codigo: "/colors blue 70 FFFFFF 3F0B74 360963 360963",
            nombreEquipo: "ORLANDO CITY"
        },
        "orl/alternativa/red": {
            codigo: "/colors red 180 3F0B74 FFFFFF",
            nombreEquipo: "ORLANDO CITY"
        },
        "orl/alternativa/blue": {
            codigo: "/colors blue 180 3F0B74 FFFFFF",
            nombreEquipo: "ORLANDO CITY"
        },
    
        // ESTUDIANTES (BA)
        "eba/titular/red": {
            codigo: "/colors red 180 8C8C8C FFFFFF 000000 FFFFFF",
            nombreEquipo: "ESTUDIANTES (BA)"
        },
        "eba/titular/blue": {
            codigo: "/colors blue 180 8C8C8C FFFFFF 000000 FFFFFF",
            nombreEquipo: "ESTUDIANTES (BA)"
        },
        "eba/alternativa/red": {
            codigo: "/colors red 115 050505 EAE4E6 FFFFFF A89D9B",
            nombreEquipo: "ESTUDIANTES (BA)"
        },
        "eba/alternativa/blue": {
            codigo: "/colors blue 115 050505 EAE4E6 FFFFFF A89D9B",
            nombreEquipo: "ESTUDIANTES (BA)"
        },
    
        // ALMIRANTE BROWN
        "abrown/titular/red": {
            codigo: "/colors red 180 FFFFFF EBC80E 000000 EBC80E",
            nombreEquipo: "ALMIRANTE BROWN"
        },
        "abrown/titular/blue": {
            codigo: "/colors blue 180 FFFFFF EBC80E 000000 EBC80E",
            nombreEquipo: "ALMIRANTE BROWN"
        },
        "abrown/alternativa/red": {
            codigo: "/colors red 0 FFF34F 131313 131313 EBC80E",
            nombreEquipo: "ALMIRANTE BROWN"
        },
        "abrown/alternativa/blue": {
            codigo: "/colors blue 0 FFF34F 131313 131313 EBC80E",
            nombreEquipo: "ALMIRANTE BROWN"
        },
        "abrown/tercera/red": {
            codigo: "/colors red 90 E3C10E 1D1D1D FFFFFF EBC60D",
            nombreEquipo: "ALMIRANTE BROWN"
        },
        "abrown/tercera/blue": {
            codigo: "/colors blue 90 E3C10E 1D1D1D FFFFFF EBC60D",
            nombreEquipo: "ALMIRANTE BROWN"
        },
    
        // CENTRO DEPORTIVO ROCA
        "cdybgr/titular/red": {
            codigo: "/colors red 0 F7F3FF DC1E37 1C1A26",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
        "cdybgr/titular/blue": {
            codigo: "/colors blue 0 F7F3FF DC1E37 1C1A26",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
        "cdybgr/alternativa/red": {
            codigo: "/colors red 0 000000 FC224A FFFFFF C51641",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
        "cdybgr/alternativa/blue": {
            codigo: "/colors blue 0 000000 FC224A FFFFFF C51641",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
        "cdybgr/tercera/red": {
            codigo: "/colors red 0 757575 1E1916 FFFFFF DE231C",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
        "cdybgr/tercera/blue": {
            codigo: "/colors blue 0 757575 1E1916 FFFFFF DE231C",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
        "cdybgr/cuarta/red": {
            codigo: "/colors red 90 817F85 1E1916 FFFFFF DC241C",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
        "cdybgr/cuarta/blue": {
            codigo: "/colors blue 90 817F85 1E1916 FFFFFF DC241C",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
        "cdybgr/quinta/red": {
            codigo: "/colors red 0 D6BD8B 1E1916 FFFFFF DC1E37",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
        "cdybgr/quinta/blue": {
            codigo: "/colors blue 0 D6BD8B 1E1916 FFFFFF DC1E37",
            nombreEquipo: "CENTRO DEP. ROCA"
        },
    
        // BOCHOFILO BOCHAZO
        "bochz/titular/red": {
            codigo: "/colors red 40 33376B BE2833 FFFFFF 2348A0",
            nombreEquipo: "BOCHOFILO BOCHAZO"
        },
        "bochz/titular/blue": {
            codigo: "/colors blue 40 33376B BE2833 FFFFFF 2348A0",
            nombreEquipo: "BOCHOFILO BOCHAZO"
        },
    
        // DINAMO ZAGREB
        "dzg/titular/red": {
            codigo: "/colors red 180 FFFFFF 0456C6",
            nombreEquipo: "DINAMO ZAGREB"
        },
        "dzg/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 0456C6",
            nombreEquipo: "DINAMO ZAGREB"
        },
        "dzg/alternativa/red": {
            codigo: "/colors red 60 1B1F10 DDFF51 E1FD5B",
            nombreEquipo: "DINAMO ZAGREB"
        },
        "dzg/alternativa/blue": {
            codigo: "/colors blue 60 1B1F10 DDFF51 E1FD5B",
            nombreEquipo: "DINAMO ZAGREB"
        },
        "dzg/tercera/red": {
            codigo: "/colors red 120 E5E811 213C69 1555AC",
            nombreEquipo: "DINAMO ZAGREB"
        },
        "dzg/tercera/blue": {
            codigo: "/colors blue 120 E5E811 213C69 1555AC",
            nombreEquipo: "DINAMO ZAGREB"
        },
    
        // BAYER LEVERKUSEN
        "b04/titular/red": {
            codigo: "/colors red 180 F6F8F7 252526 363636 252526",
            nombreEquipo: "BAYER LEVERKUSEN"
        },
        "b04/titular/blue": {
            codigo: "/colors blue 180 F6F8F7 252526 363636 252526",
            nombreEquipo: "BAYER LEVERKUSEN"
        },
        "b04/alternativa/red": {
            codigo: "/colors red 0 F1F2F4 E30720 F12D31 E30720",
            nombreEquipo: "BAYER LEVERKUSEN"
        },
        "b04/alternativa/blue": {
            codigo: "/colors blue 0 F1F2F4 E30720 F12D31 E30720",
            nombreEquipo: "BAYER LEVERKUSEN"
        },
        "b04/tercera/red": {
            codigo: "/colors red 30 262930 CACFD5 C3CCD3 CACFD5",
            nombreEquipo: "BAYER LEVERKUSEN"
        },
        "b04/tercera/blue": {
            codigo: "/colors blue 30 262930 CACFD5 C3CCD3 CACFD5",
            nombreEquipo: "BAYER LEVERKUSEN"
        },
    
        // VENEZIA FC
        "venfc/titular/red": {
            codigo: "/colors red 0 FFFFFF FE7200 161C28 008956",
            nombreEquipo: "VENEZIA FC"
        },
        "venfc/titular/blue": {
            codigo: "/colors blue 0 FFFFFF FE7200 161C28 008956",
            nombreEquipo: "VENEZIA FC"
        },
    
        // ATHLETIC BILBAO
        "ath/titular/red": {
            codigo: "/colors red 0 020300 EA011E FFFFFF EA011E",
            nombreEquipo: "ATHLETIC BILBAO"
        },
        "ath/titular/blue": {
            codigo: "/colors blue 0 020300 EA011E FFFFFF EA011E",
            nombreEquipo: "ATHLETIC BILBAO"
        },
        "ath/alternativa/red": {
            codigo: "/colors red 121 DECB89 225F3E 225F3E 30734A",
            nombreEquipo: "ATHLETIC BILBAO"
        },
        "ath/alternativa/blue": {
            codigo: "/colors blue 121 DECB89 225F3E 225F3E 30734A",
            nombreEquipo: "ATHLETIC BILBAO"
        },
    
        // ESPANYOL
        "rcde/titular/red": {
            codigo: "/colors red 0 272624 FFFFFF 006DB5 FFFFFF",
            nombreEquipo: "ESPANYOL"
        },
        "rcde/titular/blue": {
            codigo: "/colors blue 0 272624 FFFFFF 006DB5 FFFFFF",
            nombreEquipo: "ESPANYOL"
        },
        "rcde/alternativa/red": {
            codigo: "/colors red 0 FFFFFF 275F56 1B81D3 EBEDF2",
            nombreEquipo: "ESPANYOL"
        },
        "rcde/alternativa/blue": {
            codigo: "/colors blue 0 FFFFFF 275F56 1B81D3 EBEDF2",
            nombreEquipo: "ESPANYOL"
        },
        "rcde/tercera/red": {
            codigo: "/colors red 90 1E1916 F5CDCD F5ECE3 39282E",
            nombreEquipo: "ESPANYOL"
        },
        "rcde/tercera/blue": {
            codigo: "/colors blue 90 1E1916 F5CDCD F5ECE3 39282E",
            nombreEquipo: "ESPANYOL"
        },
        // RB LEIPZIG
        "rbl/titular/red": {
            codigo: "/colors red 60 DC0741 F0EDEE E3E0E1",
            nombreEquipo: "RB LEIPZIG"
        },
        "rbl/titular/blue": {
            codigo: "/colors blue 60 DC0741 F0EDEE E3E0E1",
            nombreEquipo: "RB LEIPZIG"
        },
        "rbl/alternativa/red": {
            codigo: "/colors red 180 DC0741 0D1E2D",
            nombreEquipo: "RB LEIPZIG"
        },
        "rbl/alternativa/blue": {
            codigo: "/colors blue 180 DC0741 0D1E2D",
            nombreEquipo: "RB LEIPZIG"
        },
        "rbl/tercera/red": {
            codigo: "/colors red 90 FEFEFE 242426 0E4182 A60D17",
            nombreEquipo: "RB LEIPZIG"
        },
        "rbl/tercera/blue": {
            codigo: "/colors blue 90 FEFEFE 242426 0E4182 A60D17",
            nombreEquipo: "RB LEIPZIG"
        },
    
        // MONTEVIDEO CITY TORQUE
        "mct/titular/red": {
            codigo: "/colors red 60 FFFFFF 76B3E2",
            nombreEquipo: "MONTEVIDEO CITY"
        },
        "mct/titular/blue": {
            codigo: "/colors blue 60 FFFFFF 76B3E2",
            nombreEquipo: "MONTEVIDEO CITY"
        },
        "mct/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 322D2A 413C39 484743",
            nombreEquipo: "MONTEVIDEO CITY"
        },
        "mct/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 322D2A 413C39 484743",
            nombreEquipo: "MONTEVIDEO CITY"
        },
    
        // MONTEVIDEO WANDERERS
        "wan/titular/red": {
            codigo: "/colors red 180 B8B8B8 FFFFFF 000000 FFFFFF",
            nombreEquipo: "MONTEVIDEO WANDERERS"
        },
        "wan/titular/blue": {
            codigo: "/colors blue 180 B8B8B8 FFFFFF 000000 FFFFFF",
            nombreEquipo: "MONTEVIDEO WANDERERS"
        },
        "wan/alternativa/red": {
            codigo: "/colors red 180 000000 78DEF9 A6E2F9 78DEF9",
            nombreEquipo: "MONTEVIDEO WANDERERS"
        },
        "wan/alternativa/blue": {
            codigo: "/colors blue 180 000000 78DEF9 A6E2F9 78DEF9",
            nombreEquipo: "MONTEVIDEO WANDERERS"
        },
        "wan/tercera/red": {
            codigo: "/colors red 180 000000 FFFFFF F1F1F1 FFFFFF",
            nombreEquipo: "MONTEVIDEO WANDERERS"
        },
        "wan/tercera/blue": {
            codigo: "/colors blue 180 000000 FFFFFF F1F1F1 FFFFFF",
            nombreEquipo: "MONTEVIDEO WANDERERS"
        },
    
        // HAMBURGER SV
        "hsv/titular/red": {
            codigo: "/colors red 90 0071D7 D40121 F2F1F7 F2F1F7",
            nombreEquipo: "HAMBURGER SV"
        },
        "hsv/titular/blue": {
            codigo: "/colors blue 90 0071D7 D40121 F2F1F7 F2F1F7",
            nombreEquipo: "HAMBURGER SV"
        },
        "hsv/alternativa/red": {
            codigo: "/colors red 180 FFFFFF FBB6D5 6D5E7C FBB6D5",
            nombreEquipo: "HAMBURGER SV"
        },
        "hsv/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF FBB6D5 6D5E7C FBB6D5",
            nombreEquipo: "HAMBURGER SV"
        },
        "hsv/tercera/red": {
            codigo: "/colors red 180 FFFFFF 2D2B2C 0D497D 2D2B2C",
            nombreEquipo: "HAMBURGER SV"
        },
        "hsv/tercera/blue": {
            codigo: "/colors blue 180 FFFFFF 2D2B2C 0D497D 2D2B2C",
            nombreEquipo: "HAMBURGER SV"
        },
    
        // NEWCASTLE UNITED
        "new/titular/red": {
            codigo: "/colors red 180 EA323E F6F5FA 29242A F6F5FA",
            nombreEquipo: "NEWCASTLE UNITED"
        },
        "new/titular/blue": {
            codigo: "/colors blue 180 EA323E F6F5FA 29242A F6F5FA",
            nombreEquipo: "NEWCASTLE UNITED"
        },
        "new/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 1C2023 143439 143439",
            nombreEquipo: "NEWCASTLE UNITED"
        },
        "new/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 1C2023 143439 143439",
            nombreEquipo: "NEWCASTLE UNITED"
        },
        "new/tercera/red": {
            codigo: "/colors red 90 111C4D EC440A F06C0F F06C0F",
            nombreEquipo: "NEWCASTLE UNITED"
        },
        "new/tercera/blue": {
            codigo: "/colors blue 90 111C4D EC440A F06C0F F06C0F",
            nombreEquipo: "NEWCASTLE UNITED"
        },
    
        // WEST HAM UNITED
        "whu/titular/red": {
            codigo: "/colors red 90 F3F2F7 C4E0EC 7C0C25 7C0C25",
            nombreEquipo: "WEST HAM"
        },
        "whu/titular/blue": {
            codigo: "/colors blue 90 F3F2F7 C4E0EC 7C0C25 7C0C25",
            nombreEquipo: "WEST HAM"
        },
        "whu/alternativa/red": {
            codigo: "/colors red 90 781A32 A8D5FF F4F4F4 F4F4F4",
            nombreEquipo: "WEST HAM"
        },
        "whu/alternativa/blue": {
            codigo: "/colors blue 90 781A32 A8D5FF F4F4F4 F4F4F4",
            nombreEquipo: "WEST HAM"
        },
        "whu/tercera/red": {
            codigo: "/colors red 58 FFFFFF AB2FC3 2C2B54 342F5F",
            nombreEquipo: "WEST HAM"
        },
        "whu/tercera/blue": {
            codigo: "/colors blue 58 FFFFFF AB2FC3 2C2B54 342F5F",
            nombreEquipo: "WEST HAM"
        },
        "whu/titular/red/2019": {
            codigo: "/colors red 90 FFFFFF A3C3EA 751A2C 751A2C",
            nombreEquipo: "WEST HAM"
        },
        "whu/titular/blue/2019": {
            codigo: "/colors blue 90 FFFFFF A3C3EA 751A2C 751A2C",
            nombreEquipo: "WEST HAM"
        },
    
        // TORONTO FC
        "tofc/titular/red": {
            codigo: "/colors red 33 FFFFFF E50126",
            nombreEquipo: "TORONTO FC"
        },
        "tofc/titular/blue": {
            codigo: "/colors blue 33 FFFFFF E50126",
            nombreEquipo: "TORONTO FC"
        },
        "tofc/alternativa/red": {
            codigo: "/colors red 240 1D1C21 E6EBEF",
            nombreEquipo: "TORONTO FC"
        },
        "tofc/alternativa/blue": {
            codigo: "/colors blue 240 1D1C21 E6EBEF",
            nombreEquipo: "TORONTO FC"
        },
    
        // INTER MIAMI CF
        "mia/titular/red": {
            codigo: "/colors red 180 2E2322 FEA3B4",
            nombreEquipo: "INTER MIAMI"
        },
        "mia/titular/blue": {
            codigo: "/colors blue 180 2E2322 FEA3B4",
            nombreEquipo: "INTER MIAMI"
        },
        "mia/alternativa/red": {
            codigo: "/colors red 90 FBCCD4 212123 2E2E30 212123",
            nombreEquipo: "INTER MIAMI"
        },
        "mia/alternativa/blue": {
            codigo: "/colors blue 90 FBCCD4 212123 2E2E30 212123",
            nombreEquipo: "INTER MIAMI"
        },
    
        // DEPORTIVO ESPAÑOL
        "cde/titular/red": {
            codigo: "/colors red 66 FFFFFF FFC100 CD0000 CD0000",
            nombreEquipo: "DEP. ESPAÑOL"
        },
        "cde/titular/blue": {
            codigo: "/colors blue 66 FFFFFF FFC100 CD0000 CD0000",
            nombreEquipo: "DEP. ESPAÑOL"
        },
        "cde/alternativa/red": {
            codigo: "/colors red 66 242D51 C80000 FFFFFF FFFFFF",
            nombreEquipo: "DEP. ESPAÑOL"
        },
        "cde/alternativa/blue": {
            codigo: "/colors blue 66 242D51 C80000 FFFFFF FFFFFF",
            nombreEquipo: "DEP. ESPAÑOL"
        },
    
        // SPORTIVO ITALIANO
        "sit/titular/red": {
            codigo: "/colors red 307 FFFFFF 1367C0 1367C0 374A89",
            nombreEquipo: "SPORTIVO ITALIANO"
        },
        "sit/titular/blue": {
            codigo: "/colors blue 307 FFFFFF 1367C0 1367C0 374A89",
            nombreEquipo: "SPORTIVO ITALIANO"
        },
        "sit/alternativa/red": {
            codigo: "/colors red 65 1E2C94 0D3986 FFFFFF FFFFFF",
            nombreEquipo: "SPORTIVO ITALIANO"
        },
        "sit/alternativa/blue": {
            codigo: "/colors blue 65 1E2C94 0D3986 FFFFFF FFFFFF",
            nombreEquipo: "SPORTIVO ITALIANO"
        },
        "sit/tercera/red": {
            codigo: "/colors red 180 FAF7FF 0C785B DF1B2B 0C785B",
            nombreEquipo: "SPORTIVO ITALIANO"
        },
        "sit/tercera/blue": {
            codigo: "/colors blue 180 FAF7FF 0C785B DF1B2B 0C785B",
            nombreEquipo: "SPORTIVO ITALIANO"
        },
        // CLUB DEPORTIVO MANDIYÚ
        "mdy/titular/red": {
            codigo: "/colors red 90 1AAD69 11B065 FFFFFF FFFFFF",
            nombreEquipo: "DEP. MANDIYÚ"
        },
        "mdy/titular/blue": {
            codigo: "/colors blue 90 1AAD69 11B065 FFFFFF FFFFFF",
            nombreEquipo: "DEP. MANDIYÚ"
        },
        "mdy/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 81D368 61CA65 61CA65",
            nombreEquipo: "DEP. MANDIYÚ"
        },
        "mdy/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 81D368 61CA65 61CA65",
            nombreEquipo: "DEP. MANDIYÚ"
        },
    
        // HULL CITY
        "hul/titular/red": {
            codigo: "/colors red 247 000000 F77F15 F77F15 180602",
            nombreEquipo: "HULL CITY"
        },
        "hul/titular/blue": {
            codigo: "/colors blue 247 000000 F77F15 F77F15 180602",
            nombreEquipo: "HULL CITY"
        },
        "hul/alternativa/red": {
            codigo: "/colors red 180 000000 FFFFFF",
            nombreEquipo: "HULL CITY"
        },
        "hul/alternativa/blue": {
            codigo: "/colors blue 180 000000 FFFFFF",
            nombreEquipo: "HULL CITY"
        },
        "hul/tercera/red": {
            codigo: "/colors red 247 FFFFFF 227592 227592 FFB10F",
            nombreEquipo: "HULL CITY"
        },
        "hul/tercera/blue": {
            codigo: "/colors blue 247 FFFFFF 227592 227592 FFB10F",
            nombreEquipo: "HULL CITY"
        },
    
        // WOLVERHAMPTON
        "wol/titular/red": {
            codigo: "/colors red 90 000000 F98E29 FB9F33 FDAD3B",
            nombreEquipo: "WOLVERHAMPTON"
        },
        "wol/titular/blue": {
            codigo: "/colors blue 90 000000 F98E29 FB9F33 FDAD3B",
            nombreEquipo: "WOLVERHAMPTON"
        },
        "wol/alternativa/red": {
            codigo: "/colors red 61 FFFFFF F99F03 202020 202020",
            nombreEquipo: "WOLVERHAMPTON"
        },
        "wol/alternativa/blue": {
            codigo: "/colors blue 61 FFFFFF F99F03 202020 202020",
            nombreEquipo: "WOLVERHAMPTON"
        },
        "wol/tercera/red": {
            codigo: "/colors red 0 F5F5F5 1F6452 3AAC88",
            nombreEquipo: "WOLVERHAMPTON"
        },
        "wol/tercera/blue": {
            codigo: "/colors blue 0 F5F5F5 1F6452 3AAC88",
            nombreEquipo: "WOLVERHAMPTON"
        },
    
        // CERRO LARGO
        "crl/titular/red": {
            codigo: "/colors red 180 1F1E26 FFFFFF 2454DF FFFFFF",
            nombreEquipo: "CERRO LARGO"
        },
        "crl/titular/blue": {
            codigo: "/colors blue 180 1F1E26 FFFFFF 2454DF FFFFFF",
            nombreEquipo: "CERRO LARGO"
        },
        "crl/alternativa/red": {
            codigo: "/colors red 61 1F1E26 0098CA",
            nombreEquipo: "CERRO LARGO"
        },
        "crl/alternativa/blue": {
            codigo: "/colors blue 61 1F1E26 0098CA",
            nombreEquipo: "CERRO LARGO"
        },
    
        // OLD CALEDONIANS FOOTBALL CLUB
        "ocfc/titular/red": {
            codigo: "/colors red 90 191919 F7F6FB",
            nombreEquipo: "OLD CALEDONIANS"
        },
        "ocfc/titular/blue": {
            codigo: "/colors blue 90 191919 F7F6FB",
            nombreEquipo: "OLD CALEDONIANS"
        },
    
        // DEFENSOR SPORTING
        "dfs/titular/red": {
            codigo: "/colors red 60 FFFFFF 6D4DB4",
            nombreEquipo: "DEFENSOR SPORTING"
        },
        "dfs/titular/blue": {
            codigo: "/colors blue 60 FFFFFF 6D4DB4",
            nombreEquipo: "DEFENSOR SPORTING"
        },
        "dfs/alternativa/red": {
            codigo: "/colors red 90 402E6B FFFFFF 6D4DB4 FFFFFF",
            nombreEquipo: "DEFENSOR SPORTING"
        },
        "dfs/alternativa/blue": {
            codigo: "/colors blue 90 402E6B FFFFFF 6D4DB4 FFFFFF",
            nombreEquipo: "DEFENSOR SPORTING"
        },
    
        // EVERTON VIÑA DEL MAR
        "evdm/titular/red": {
            codigo: "/colors red 90 FFFFFF 212647 FFE751 212647",
            nombreEquipo: "EVERTON VIÑA DEL MAR"
        },
        "evdm/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 212647 FFE751 212647",
            nombreEquipo: "EVERTON VIÑA DEL MAR"
        },
        "evdm/alternativa/red": {
            codigo: "/colors red 90 FFFFFF FFD763 303454 FFD763",
            nombreEquipo: "EVERTON VIÑA DEL MAR"
        },
        "evdm/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF FFD763 303454 FFD763",
            nombreEquipo: "EVERTON VIÑA DEL MAR"
        },
    
        // UNIÓN LA CALERA
        "ulc/titular/red": {
            codigo: "/colors red 50 FFFFFF BA1D38 D70100",
            nombreEquipo: "UNIÓN LA CALERA"
        },
        "ulc/titular/blue": {
            codigo: "/colors blue 50 FFFFFF BA1D38 D70100",
            nombreEquipo: "UNIÓN LA CALERA"
        },
        "ulc/alternativa/red": {
            codigo: "/colors red 66 000000 E31D39 FFFFFF FFFFFF",
            nombreEquipo: "UNIÓN LA CALERA"
        },
        "ulc/alternativa/blue": {
            codigo: "/colors blue 66 000000 E31D39 FFFFFF FFFFFF",
            nombreEquipo: "UNIÓN LA CALERA"
        },
    
        // AUDAX ITALIANO
        "aud/titular/red": {
            codigo: "/colors red 60 FFFFFF 045AD1",
            nombreEquipo: "AUDAX ITALIANO"
        },
        "aud/titular/blue": {
            codigo: "/colors blue 60 FFFFFF 045AD1",
            nombreEquipo: "AUDAX ITALIANO"
        },
        "aud/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 118247",
            nombreEquipo: "AUDAX ITALIANO"
        },
        "aud/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 118247",
            nombreEquipo: "AUDAX ITALIANO"
        },
        "aud/tercera/red": {
            codigo: "/colors red 90 339455 FFFFFF",
            nombreEquipo: "AUDAX ITALIANO"
        },
        "aud/tercera/blue": {
            codigo: "/colors blue 90 339455 FFFFFF",
            nombreEquipo: "AUDAX ITALIANO"
        },
        // HUACHIPATO
        "hua/titular/red": {
            codigo: "/colors red 180 FBFB1D 2B79F7 1F1F21 2B79F7",
            nombreEquipo: "HUACHIPATO"
        },
        "hua/titular/blue": {
            codigo: "/colors blue 180 FBFB1D 2B79F7 1F1F21 2B79F7",
            nombreEquipo: "HUACHIPATO"
        },
        "hua/alternativa/red": {
            codigo: "/colors red 180 FCFAFF BD1F36 711F2D BD1F36",
            nombreEquipo: "HUACHIPATO"
        },
        "hua/alternativa/blue": {
            codigo: "/colors blue 180 FCFAFF BD1F36 711F2D BD1F36",
            nombreEquipo: "HUACHIPATO"
        },
    
        // DEPORTES IQUIQUE
        "iqu/titular/red": {
            codigo: "/colors red 180 000000 A5D4FE 9DD3FF",
            nombreEquipo: "DEPORTES IQUIQUE"
        },
        "iqu/titular/blue": {
            codigo: "/colors blue 180 000000 A5D4FE 9DD3FF",
            nombreEquipo: "DEPORTES IQUIQUE"
        },
        "iqu/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 2557DA FF1727 2557DA",
            nombreEquipo: "DEPORTES IQUIQUE"
        },
        "iqu/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 2557DA FF1727 2557DA",
            nombreEquipo: "DEPORTES IQUIQUE"
        },
    
        // O'HIGGINS
        "ohi/titular/red": {
            codigo: "/colors red 60 000000 90C4EB",
            nombreEquipo: "O'HIGGINS"
        },
        "ohi/titular/blue": {
            codigo: "/colors blue 60 000000 90C4EB",
            nombreEquipo: "O'HIGGINS"
        },
        "ohi/alternativa/red": {
            codigo: "/colors red 60 FFFFFF 1E1E1F",
            nombreEquipo: "O'HIGGINS"
        },
        "ohi/alternativa/blue": {
            codigo: "/colors blue 60 FFFFFF 1E1E1F",
            nombreEquipo: "O'HIGGINS"
        },
        "ohi/tercera/red": {
            codigo: "/colors red 90 000000 FFFFFF BCBFC4 FFFFFF",
            nombreEquipo: "O'HIGGINS"
        },
        "ohi/tercera/blue": {
            codigo: "/colors blue 90 000000 FFFFFF BCBFC4 FFFFFF",
            nombreEquipo: "O'HIGGINS"
        },
    
        // UNIÓN ESPAÑOLA
        "ues/titular/red": {
            codigo: "/colors red 90 FFFFFF C5142E CF0D27 E01A33",
            nombreEquipo: "UNIÓN ESPAÑOLA"
        },
        "ues/titular/blue": {
            codigo: "/colors blue 90 FFFFFF C5142E CF0D27 E01A33",
            nombreEquipo: "UNIÓN ESPAÑOLA"
        },
        "ues/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 5D5D5D 717173 848484",
            nombreEquipo: "UNIÓN ESPAÑOLA"
        },
        "ues/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 5D5D5D 717173 848484",
            nombreEquipo: "UNIÓN ESPAÑOLA"
        },
    
        // SANTIAGO WANDERERS
        "swa/titular/red": {
            codigo: "/colors red 90 78FF28 017060 024A3E 024A3E",
            nombreEquipo: "SANTIAGO WANDERERS"
        },
        "swa/titular/blue": {
            codigo: "/colors blue 90 78FF28 017060 024A3E 024A3E",
            nombreEquipo: "SANTIAGO WANDERERS"
        },
        "swa/alternativa/red": {
            codigo: "/colors red 90 154142 FFFFFF C8C7CC FFFFFF",
            nombreEquipo: "SANTIAGO WANDERERS"
        },
        "swa/alternativa/blue": {
            codigo: "/colors blue 90 154142 FFFFFF C8C7CC FFFFFF",
            nombreEquipo: "SANTIAGO WANDERERS"
        },
    
        // CURICÓ UNIDO
        "cur/titular/red": {
            codigo: "/colors red 35 6E1010 FFFFFF D92814 FFFFFF",
            nombreEquipo: "CURICÓ UNIDO"
        },
        "cur/titular/blue": {
            codigo: "/colors blue 35 6E1010 FFFFFF D92814 FFFFFF",
            nombreEquipo: "CURICÓ UNIDO"
        },
        "cur/alternativa/red": {
            codigo: "/colors red 35 ABABAB D92814 FFFFFF D92814",
            nombreEquipo: "CURICÓ UNIDO"
        },
        "cur/alternativa/blue": {
            codigo: "/colors blue 35 ABABAB D92814 FFFFFF D92814",
            nombreEquipo: "CURICÓ UNIDO"
        },
    
        // DEPORTES ANTOFAGASTA
        "cda/titular/red": {
            codigo: "/colors red 0 1865A5 FFFFFF 328AF8",
            nombreEquipo: "DEP. ANTOFAGASTA"
        },
        "cda/titular/blue": {
            codigo: "/colors blue 0 1865A5 FFFFFF 328AF8",
            nombreEquipo: "DEP. ANTOFAGASTA"
        },
        "cda/alternativa/red": {
            codigo: "/colors red 0 FFFFFF 1A1A1A D71F29",
            nombreEquipo: "DEP. ANTOFAGASTA"
        },
        "cda/alternativa/blue": {
            codigo: "/colors blue 0 FFFFFF 1A1A1A D71F29",
            nombreEquipo: "DEP. ANTOFAGASTA"
        },
    
        // U. DE CONCEPCIÓN
        "ucon/titular/red": {
            codigo: "/colors red 90 2C3554 F1E63E F1E63E F1E63E",
            nombreEquipo: "U. DE CONCEPCIÓN"
        },
        "ucon/titular/blue": {
            codigo: "/colors blue 90 2C3554 F1E63E F1E63E F1E63E",
            nombreEquipo: "U. DE CONCEPCIÓN"
        },
        "ucon/alternativa/red": {
            codigo: "/colors red 60 FEEB2C 6285ED 293155 293155",
            nombreEquipo: "U. DE CONCEPCIÓN"
        },
        "ucon/alternativa/blue": {
            codigo: "/colors blue 60 FEEB2C 6285ED 293155 293155",
            nombreEquipo: "U. DE CONCEPCIÓN"
        },
    
        // DEPORTES LA SERENA
        "dls/titular/red": {
            codigo: "/colors red 60 FEFEFE 530928 450722 450722",
            nombreEquipo: "DEP. LA SERENA"
        },
        "dls/titular/blue": {
            codigo: "/colors blue 60 FEFEFE 530928 450722 450722",
            nombreEquipo: "DEP. LA SERENA"
        },
        "dls/alternativa/red": {
            codigo: "/colors red 60 5D0027 FFFFFF EEEEEE EEEEEE",
            nombreEquipo: "DEP. LA SERENA"
        },
        "dls/alternativa/blue": {
            codigo: "/colors blue 60 5D0027 FFFFFF EEEEEE EEEEEE",
            nombreEquipo: "DEP. LA SERENA"
        },
        // COQUIMBO UNIDO
        "coq/titular/red": {
            codigo: "/colors red 0 000000 202020 F4C505",
            nombreEquipo: "COQUIMBO UNIDO"
        },
        "coq/titular/blue": {
            codigo: "/colors blue 0 000000 202020 F4C505",
            nombreEquipo: "COQUIMBO UNIDO"
        },
        "coq/alternativa/red": {
            codigo: "/colors red 55 000000 E7E7E7 E7E7E7 F4C606",
            nombreEquipo: "COQUIMBO UNIDO"
        },
        "coq/alternativa/blue": {
            codigo: "/colors blue 55 000000 E7E7E7 E7E7E7 F4C606",
            nombreEquipo: "COQUIMBO UNIDO"
        },
    
        // SPIDERMAN
        "spiderman/red": {
            codigo: "/colors red 90 DF1F2D DF1F2D 2B3784 2B3784",
            nombreEquipo: "TEAM SPIDERMAN"
        },
        "spiderman/blue": {
            codigo: "/colors blue 90 DF1F2D DF1F2D 2B3784 2B3784",
            nombreEquipo: "TEAM SPIDERMAN"
        },
    
        // HULK
        "hulk/red": {
            codigo: "/colors red 90 A2CD48 A2CD48 A2CD48 875094",
            nombreEquipo: "TEAM HULK"
        },
        "hulk/blue": {
            codigo: "/colors blue 90 A2CD48 A2CD48 A2CD48 875094",
            nombreEquipo: "TEAM HULK"
        },
    
        // CAPITÁN AMÉRICA
        "capitanamerica/red": {
            codigo: "/colors red 90 FFFFFF 1849CA 1849CA EC2004",
            nombreEquipo: "TEAM CAPITÁN AMÉRICA"
        },
        "capitanamerica/blue": {
            codigo: "/colors blue 90 FFFFFF 1849CA 1849CA EC2004",
            nombreEquipo: "TEAM CAPITÁN AMÉRICA"
        },
    
        // BATMAN
        "batman/red": {
            codigo: "/colors red 90 FDFF00 282E3C 282E3C 505C7C",
            nombreEquipo: "TEAM BATMAN"
        },
        "batman/blue": {
            codigo: "/colors blue 90 FDFF00 282E3C 282E3C 505C7C",
            nombreEquipo: "TEAM BATMAN"
        },
    
        // BELGRANO ATHLETIC CLUB
        "bac/titular/red": {
            codigo: "/colors red 90 FFFFFF FFCC00 994C00 FFCC00",
            nombreEquipo: "BELGRANO ATHLETIC CLUB"
        },
        "bac/titular/blue": {
            codigo: "/colors blue 90 FFFFFF FFCC00 994C00 FFCC00",
            nombreEquipo: "BELGRANO ATHLETIC CLUB"
        },
        "bac/alternativa/red": {
            codigo: "/colors red 180 FFEB20 1B7967 FE3045 1B7967",
            nombreEquipo: "BELGRANO ATHLETIC CLUB"
        },
        "bac/alternativa/blue": {
            codigo: "/colors blue 180 FFEB20 1B7967 FE3045 1B7967",
            nombreEquipo: "BELGRANO ATHLETIC CLUB"
        },
    
        // ROSARIO ATHLETIC CLUB
        "roac/titular/red": {
            codigo: "/colors red 0 FFFFFF 8F3A52 229CD8",
            nombreEquipo: "ROSARIO ATHLETIC CLUB"
        },
        "roac/titular/blue": {
            codigo: "/colors blue 0 FFFFFF 8F3A52 229CD8",
            nombreEquipo: "ROSARIO ATHLETIC CLUB"
        },
    
        // CLUB ATLÉTICO PORTEÑO
        "caport/titular/red": {
            codigo: "/colors red 0 2B2B2B FFFFFF 4B55D9 FFFFFF",
            nombreEquipo: "CA. PORTEÑO"
        },
        "caport/titular/blue": {
            codigo: "/colors blue 0 2B2B2B FFFFFF 4B55D9 FFFFFF",
            nombreEquipo: "CA. PORTEÑO"
        },
    
        // VILLAREAL
        "vil/titular/red": {
            codigo: "/colors red 90 194667 F9EA6B",
            nombreEquipo: "VILLAREAL"
        },
        "vil/titular/blue": {
            codigo: "/colors blue 90 194667 F9EA6B",
            nombreEquipo: "VILLAREAL"
        },
        "vil/alternativa/red": {
            codigo: "/colors red 90 E1DC06 143151",
            nombreEquipo: "VILLAREAL"
        },
        "vil/alternativa/blue": {
            codigo: "/colors blue 90 E1DC06 143151",
            nombreEquipo: "VILLAREAL"
        },
    
        // CELTA DE VIGO
        "cel/titular/red": {
            codigo: "/colors red 136 141414 43B5F4 8DDDFE 8DDDFE",
            nombreEquipo: "CELTA DE VIGO"
        },
        "cel/titular/blue": {
            codigo: "/colors blue 136 141414 43B5F4 8DDDFE 8DDDFE",
            nombreEquipo: "CELTA DE VIGO"
        },
    
        // MALLORCA
        "mll/titular/red": {
            codigo: "/colors red 90 FFFFFF FE5341 D42A2A D42A2A",
            nombreEquipo: "MALLORCA"
        },
        "mll/titular/blue": {
            codigo: "/colors blue 90 FFFFFF FE5341 D42A2A D42A2A",
            nombreEquipo: "MALLORCA"
        },
    
        // LEEDS UNITED
        "lee/titular/red": {
            codigo: "/colors red 123 000000 E7FE68 FFFFFF FFFFFF",
            nombreEquipo: "LEEDS UNITED"
        },
        "lee/titular/blue": {
            codigo: "/colors blue 123 000000 E7FE68 FFFFFF FFFFFF",
            nombreEquipo: "LEEDS UNITED"
        },
        "lee/alternativa/red": {
            codigo: "/colors red 123 FFFFFF 00113D 021A86 021A86",
            nombreEquipo: "LEEDS UNITED"
        },
        "lee/alternativa/blue": {
            codigo: "/colors blue 123 FFFFFF 00113D 021A86 021A86",
            nombreEquipo: "LEEDS UNITED"
        },
    
        // SUIZA
        "sui/titular/red": {
            codigo: "/colors red 90 F3EDF1 F8F8F8 F6272F F6272F",
            nombreEquipo: "SUIZA"
        },
        "sui/titular/blue": {
            codigo: "/colors blue 90 F3EDF1 F8F8F8 F6272F F6272F",
            nombreEquipo: "SUIZA"
        },
        "sui/alternativa/red": {
            codigo: "/colors red 90 A12638 F6F7FC F9EBF5 F1DDE4",
            nombreEquipo: "SUIZA"
        },
        "sui/alternativa/blue": {
            codigo: "/colors blue 90 A12638 F6F7FC F9EBF5 F1DDE4",
            nombreEquipo: "SUIZA"
        },
        "sui/titular2021/red": {
            codigo: "/colors red 90 FFFFFF 770316 E40017 E40017",
            nombreEquipo: "SUIZA"
        },
        "sui/titular2021/blue": {
            codigo: "/colors blue 90 FFFFFF 770316 E40017 E40017",
            nombreEquipo: "SUIZA"
        },
    
        // SUECIA
        "swe/titular/red": {
            codigo: "/colors red 123 2D4466 F3E731",
            nombreEquipo: "SUECIA"
        },
        "swe/titular/blue": {
            codigo: "/colors blue 123 2D4466 F3E731",
            nombreEquipo: "SUECIA"
        },
        "swe/alternativa/red": {
            codigo: "/colors red 90 F3EA5D F0EB0B 152A49 1B2E4E",
            nombreEquipo: "SUECIA"
        },
        "swe/alternativa/blue": {
            codigo: "/colors blue 90 F3EA5D F0EB0B 152A49 1B2E4E",
            nombreEquipo: "SUECIA"
        },
    
        // CRUCERO DEL NORTE
        "cdn/titular/red": {
            codigo: "/colors red 90 000000 FEED6B FEED6B 5F5D58",
            nombreEquipo: "CRUCERO DEL NORTE"
        },
        "cdn/titular/blue": {
            codigo: "/colors blue 90 000000 FEED6B FEED6B 5F5D58",
            nombreEquipo: "CRUCERO DEL NORTE"
        },
        "cdn/titular/2014/red": {
            codigo: "/colors red 0 1E1E1E F8E409 F58603",
            nombreEquipo: "CRUCERO DEL NORTE"
        },
        "cdn/titular/2014/blue": {
            codigo: "/colors blue 0 1E1E1E F8E409 F58603",
            nombreEquipo: "CRUCERO DEL NORTE"
        },
        "cdn/alternativa/2014/red": {
            codigo: "/colors red 0 1E1D2D EB5C32 EEED33",
            nombreEquipo: "CRUCERO DEL NORTE"
        },
        "cdn/alternativa/2014/blue": {
            codigo: "/colors blue 0 1E1D2D EB5C32 EEED33",
            nombreEquipo: "CRUCERO DEL NORTE"
        },
        "cdn/titular/2013/red": {
            codigo: "/colors red 116 1D1E10 E74A03 F8E622 F8E622",
            nombreEquipo: "CRUCERO DEL NORTE"
        },
        "cdn/titular/2013/blue": {
            codigo: "/colors blue 116 1D1E10 E74A03 F8E622 F8E622",
            nombreEquipo: "CRUCERO DEL NORTE"
        },
    
        // SC BRAGA
        "scb/titular/red": {
            codigo: "/colors red 127 C2C2C2 FFFFFF FD2F22 FD2F22",
            nombreEquipo: "SC BRAGA"
        },
        "scb/titular/blue": {
            codigo: "/colors blue 127 C2C2C2 FFFFFF FD2F22 FD2F22",
            nombreEquipo: "SC BRAGA"
        },
    
        // SPORTING CP
        "spo/titular/red": {
            codigo: "/colors red 90 252A30 0F8469 FFFFFF 0F8469",
            nombreEquipo: "SPORTING CP"
        },
        "spo/titular/blue": {
            codigo: "/colors blue 90 252A30 0F8469 FFFFFF 0F8469",
            nombreEquipo: "SPORTING CP"
        },
    
        // FC PORTO
        "fcp/titular/red": {
            codigo: "/colors red 180 F83539 013FBB FFFFFF 013FBB",
            nombreEquipo: "FC PORTO"
        },
        "fcp/titular/blue": {
            codigo: "/colors blue 180 F83539 013FBB FFFFFF 013FBB",
            nombreEquipo: "FC PORTO"
        },
    
        // SL BENFICA
        "ben/titular/red": {
            codigo: "/colors red 90 FFFFFF E62B32",
            nombreEquipo: "SL BENFICA"
        },
        "ben/titular/blue": {
            codigo: "/colors blue 90 FFFFFF E62B32",
            nombreEquipo: "SL BENFICA"
        },
        // CAMERÚN
        "cmr/titular/red": {
            codigo: "/colors red 110 F7D504 CF1F24 016D3C 016D3C",
            nombreEquipo: "CAMERÚN"
        },
        "cmr/titular/blue": {
            codigo: "/colors blue 110 F7D504 CF1F24 016D3C 016D3C",
            nombreEquipo: "CAMERÚN"
        },
        "cmr/alternativa/red": {
            codigo: "/colors red 110 048350 E22B31 F6E000 FAD701",
            nombreEquipo: "CAMERÚN"
        },
        "cmr/alternativa/blue": {
            codigo: "/colors blue 110 048350 E22B31 F6E000 FAD701",
            nombreEquipo: "CAMERÚN"
        },
    
        // COSTA DE MARFIL
        "cdm/titular/red": {
            codigo: "/colors red 90 EEEEEE 038650 FE9D01 F26909",
            nombreEquipo: "COSTA DE MARFIL"
        },
        "cdm/titular/blue": {
            codigo: "/colors blue 90 EEEEEE 038650 FE9D01 F26909",
            nombreEquipo: "COSTA DE MARFIL"
        },
        "cdm/alternativa/red": {
            codigo: "/colors red 90 FFAD2F F7F7F9",
            nombreEquipo: "COSTA DE MARFIL"
        },
        "cdm/alternativa/blue": {
            codigo: "/colors blue 90 FFAD2F F7F7F9",
            nombreEquipo: "COSTA DE MARFIL"
        },
    
        // UCRANIA
        "ukr/titular/red": {
            codigo: "/colors red 90 0083D5 019FE0 FAEA59 FAEA59",
            nombreEquipo: "UCRANIA"
        },
        "ukr/titular/blue": {
            codigo: "/colors blue 90 0083D5 019FE0 FAEA59 FAEA59",
            nombreEquipo: "UCRANIA"
        },
        "ukr/alternativa/red": {
            codigo: "/colors red 90 EEDD30 129CEA 12A9ED 12A9ED",
            nombreEquipo: "UCRANIA"
        },
        "ukr/alternativa/blue": {
            codigo: "/colors blue 90 EEDD30 129CEA 12A9ED 12A9ED",
            nombreEquipo: "UCRANIA"
        },
        "ukr/bandera/red": {
            codigo: "/colors red 90 24167D 005BBB FFD500",
            nombreEquipo: "UCRANIA"
        },
        "ukr/bandera/blue": {
            codigo: "/colors blue 90 24167D 005BBB FFD500",
            nombreEquipo: "UCRANIA"
        },
    
        // SAN MIGUEL
        "sm/titular/red": {
            codigo: "/colors red 180 0366C1 00933F FFFFFF 00933F",
            nombreEquipo: "SAN MIGUEL"
        },
        "sm/titular/blue": {
            codigo: "/colors blue 180 0366C1 00933F FFFFFF 00933F",
            nombreEquipo: "SAN MIGUEL"
        },
        "sm/alternativa/red": {
            codigo: "/colors red 55 80E7A6 2F485E 25374D 243145",
            nombreEquipo: "SAN MIGUEL"
        },
        "sm/alternativa/blue": {
            codigo: "/colors blue 55 80E7A6 2F485E 25374D 243145",
            nombreEquipo: "SAN MIGUEL"
        },
    
        // LAFERRERE
        "laf/titular/red": {
            codigo: "/colors red 180 D71E3E 346838 FFFFFF 346838",
            nombreEquipo: "LAFERRERE"
        },
        "laf/titular/blue": {
            codigo: "/colors blue 180 D71E3E 346838 FFFFFF 346838",
            nombreEquipo: "LAFERRERE"
        },
    
        // MÉXICO
        "mex/titular/red": {
            codigo: "/colors red 90 FFFFFF 045D55 067957 08A56C",
            nombreEquipo: "MÉXICO"
        },
        "mex/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 045D55 067957 08A56C",
            nombreEquipo: "MÉXICO"
        },
        "mex/alternativa/red": {
            codigo: "/colors red 70 E53A4C 048545 FFFFFF FFFFFF",
            nombreEquipo: "MÉXICO"
        },
        "mex/alternativa/blue": {
            codigo: "/colors blue 70 E53A4C 048545 FFFFFF FFFFFF",
            nombreEquipo: "MÉXICO"
        },
        "mex/bandera/red": {
            codigo: "/colors red 0 4D2A15 006847 FFFFFF CE1126",
            nombreEquipo: "MÉXICO"
        },
        "mex/bandera/blue": {
            codigo: "/colors blue 0 4D2A15 006847 FFFFFF CE1126",
            nombreEquipo: "MÉXICO"
        },
        "mex/tercera/red": {
            codigo: "/colors red 70 19744A 8A2F3E F1F1F3 F6F6F6",
            nombreEquipo: "MÉXICO"
        },
        "mex/tercera/blue": {
            codigo: "/colors blue 70 19744A 8A2F3E F1F1F3 F6F6F6",
            nombreEquipo: "MÉXICO"
        },
    
        // SENEGAL
        "sen/titular/red": {
            codigo: "/colors red 90 01A283 E3EFF2 F4F2E3 F9E7EC",
            nombreEquipo: "SENEGAL"
        },
        "sen/titular/blue": {
            codigo: "/colors blue 90 01A283 E3EFF2 F4F2E3 F9E7EC",
            nombreEquipo: "SENEGAL"
        },
        "sen/alternativa/red": {
            codigo: "/colors red 90 C3EC31 C0E933 38543F 38543F",
            nombreEquipo: "SENEGAL"
        },
        "sen/alternativa/blue": {
            codigo: "/colors blue 90 C3EC31 C0E933 38543F 38543F",
            nombreEquipo: "SENEGAL"
        },
        "sen/bandera/red": {
            codigo: "/colors red 0 028768 02AF94 F6DC47 FC1A2E",
            nombreEquipo: "SENEGAL"
        },
        "sen/bandera/blue": {
            codigo: "/colors blue 0 028768 02AF94 F6DC47 FC1A2E",
            nombreEquipo: "SENEGAL"
        },
    
        // IRÁN
        "irn/titular/red": {
            codigo: "/colors red 120 C52936 5CC26E FFFFFF FFFFFF",
            nombreEquipo: "IRÁN"
        },
        "irn/titular/blue": {
            codigo: "/colors blue 120 C52936 5CC26E FFFFFF FFFFFF",
            nombreEquipo: "IRÁN"
        },
        "irn/alternativa/red": {
            codigo: "/colors red 120 FFFFFF 88DC91 F0273A F0273A",
            nombreEquipo: "IRÁN"
        },
        "irn/alternativa/blue": {
            codigo: "/colors blue 120 FFFFFF 88DC91 F0273A F0273A",
            nombreEquipo: "IRÁN"
        },
    
        // POLONIA
        "pol/titular/red": {
            codigo: "/colors red 63 AB0C28 F1F2F7",
            nombreEquipo: "POLONIA"
        },
        "pol/titular/blue": {
            codigo: "/colors blue 63 AB0C28 F1F2F7",
            nombreEquipo: "POLONIA"
        },
        "pol/alternativa/red": {
            codigo: "/colors red 63 FFFFFF AD011B",
            nombreEquipo: "POLONIA"
        },
        "pol/alternativa/blue": {
            codigo: "/colors blue 63 FFFFFF AD011B",
            nombreEquipo: "POLONIA"
        },
    
        // COSTA RICA
        "crc/titular/red": {
            codigo: "/colors red 90 FFFFFF 0252B0 D80122 D80122",
            nombreEquipo: "COSTA RICA"
        },
        "crc/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 0252B0 D80122 D80122",
            nombreEquipo: "COSTA RICA"
        },
        "crc/alternativa/red": {
            codigo: "/colors red 90 263849 122A41 FFFFFF FFFFFF",
            nombreEquipo: "COSTA RICA"
        },
        "crc/alternativa/blue": {
            codigo: "/colors blue 90 263849 122A41 FFFFFF FFFFFF",
            nombreEquipo: "COSTA RICA"
        },
    
        // CANADÁ
        "can/titular/red": {
            codigo: "/colors red 90 FFFFFF F11D34 E20025 E20025",
            nombreEquipo: "CANADÁ"
        },
        "can/titular/blue": {
            codigo: "/colors blue 90 FFFFFF F11D34 E20025 E20025",
            nombreEquipo: "CANADÁ"
        },
        "can/alternativa/red": {
            codigo: "/colors red 65 ED4459 D70125 F8F8FA F8F8FA",
            nombreEquipo: "CANADÁ"
        },
        "can/alternativa/blue": {
            codigo: "/colors blue 65 ED4459 D70125 F8F8FA F8F8FA",
            nombreEquipo: "CANADÁ"
        },
    
        // MARRUECOS
        "mar/titular/red": {
            codigo: "/colors red 90 FFFFFF 038A4A F4001A F4001A",
            nombreEquipo: "MARRUECOS"
        },
        "mar/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 038A4A F4001A F4001A",
            nombreEquipo: "MARRUECOS"
        },
        "mar/alternativa/red": {
            codigo: "/colors red 90 098468 7F2830 FFFFFF FFFFFF",
            nombreEquipo: "MARRUECOS"
        },
        "mar/alternativa/blue": {
            codigo: "/colors blue 90 098468 7F2830 FFFFFF FFFFFF",
            nombreEquipo: "MARRUECOS"
        },
    
        // SERBIA
        "srb/titular/red": {
            codigo: "/colors red 120 E1B876 AF0013 CF0221 CF0221",
            nombreEquipo: "SERBIA"
        },
        "srb/titular/blue": {
            codigo: "/colors blue 120 E1B876 AF0013 CF0221 CF0221",
            nombreEquipo: "SERBIA"
        },
        "srb/alternativa/red": {
            codigo: "/colors red 90 C7DE45 1F2545 FFFFFF FFFFFF",
            nombreEquipo: "SERBIA"
        },
        "srb/alternativa/blue": {
            codigo: "/colors blue 90 C7DE45 1F2545 FFFFFF FFFFFF",
            nombreEquipo: "SERBIA"
        },
        // GHANA
        "gha/titular/red": {
            codigo: "/colors red 90 0A745C 211C22 D3D2D9 FFFFFF",
            nombreEquipo: "GHANA"
        },
        "gha/titular/blue": {
            codigo: "/colors blue 90 0A745C 211C22 D3D2D9 FFFFFF",
            nombreEquipo: "GHANA"
        },
        "gha/alternativa/red": {
            codigo: "/colors red 90 006E49 1A241C F4E100 F4E100",
            nombreEquipo: "GHANA"
        },
        "gha/alternativa/blue": {
            codigo: "/colors blue 90 006E49 1A241C F4E100 F4E100",
            nombreEquipo: "GHANA"
        },
    
        // TÚNEZ
        "tun/titular/red": {
            codigo: "/colors red 90 FE4C4F F1F2F8 FFFFFF",
            nombreEquipo: "TÚNEZ"
        },
        "tun/titular/blue": {
            codigo: "/colors blue 90 FE4C4F F1F2F8 FFFFFF",
            nombreEquipo: "TÚNEZ"
        },
        "tun/alternativa/red": {
            codigo: "/colors red 90 FFFFFF FC2539 EB0A2F",
            nombreEquipo: "TÚNEZ"
        },
        "tun/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF FC2539 EB0A2F",
            nombreEquipo: "TÚNEZ"
        },
    
        // DINAMARCA
        "den/titular/red": {
            codigo: "/colors red 90 FFFFFF F2F1F7 BD0215 DD0023",
            nombreEquipo: "DINAMARCA"
        },
        "den/titular/blue": {
            codigo: "/colors blue 90 FFFFFF F2F1F7 BD0215 DD0023",
            nombreEquipo: "DINAMARCA"
        },
        "den/alternativa/red": {
            codigo: "/colors red 65 E02435 CA0B2C FFFFFF FFFFFF",
            nombreEquipo: "DINAMARCA"
        },
        "den/alternativa/blue": {
            codigo: "/colors blue 65 E02435 CA0B2C FFFFFF FFFFFF",
            nombreEquipo: "DINAMARCA"
        },
    
        // ARABIA SAUDITA
        "ksa/titular/red": {
            codigo: "/colors red 90 02906A FFFFFF",
            nombreEquipo: "ARABIA SAUDITA"
        },
        "ksa/titular/blue": {
            codigo: "/colors blue 90 02906A FFFFFF",
            nombreEquipo: "ARABIA SAUDITA"
        },
        "ksa/alternativa/red": {
            codigo: "/colors red 130 EBF0F3 033D31 033D31 02906A",
            nombreEquipo: "ARABIA SAUDITA"
        },
        "ksa/alternativa/blue": {
            codigo: "/colors blue 130 EBF0F3 033D31 033D31 02906A",
            nombreEquipo: "ARABIA SAUDITA"
        },
    
        // COREA DEL SUR
        "kor/titular/red": {
            codigo: "/colors red 90 0F0C0F FFB6D1 FF859E EF3A46",
            nombreEquipo: "COREA DEL SUR"
        },
        "kor/titular/blue": {
            codigo: "/colors blue 90 0F0C0F FFB6D1 FF859E EF3A46",
            nombreEquipo: "COREA DEL SUR"
        },
        "kor/alternativa/red": {
            codigo: "/colors red 76 DEBF80 1C1D24 FFFFFF FFFFFF",
            nombreEquipo: "COREA DEL SUR"
        },
        "kor/alternativa/blue": {
            codigo: "/colors blue 76 DEBF80 1C1D24 FFFFFF FFFFFF",
            nombreEquipo: "COREA DEL SUR"
        },
    
        // PLAZA COLONIA
        "pcol/titular/red": {
            codigo: "/colors red 114 095320 5FB286 A8C3B2 FFFFFF",
            nombreEquipo: "PLAZA COLONIA"
        },
        "pcol/titular/blue": {
            codigo: "/colors blue 114 095320 5FB286 A8C3B2 FFFFFF",
            nombreEquipo: "PLAZA COLONIA"
        },
        "pcol/alternativa/red": {
            codigo: "/colors red 63 1BA470 151F29",
            nombreEquipo: "PLAZA COLONIA"
        },
        "pcol/alternativa/blue": {
            codigo: "/colors blue 63 1BA470 151F29",
            nombreEquipo: "PLAZA COLONIA"
        },
    
        // DEPORTIVO TACHIRA
        "tach/titular/red": {
            codigo: "/colors red 180 FFFFFF FFD401 171918 FFD401",
            nombreEquipo: "DEPORTIVO TACHIRA"
        },
        "tach/titular/blue": {
            codigo: "/colors blue 180 FFFFFF FFD401 171918 FFD401",
            nombreEquipo: "DEPORTIVO TACHIRA"
        },
        "tach/alternativa/red": {
            codigo: "/colors red 124 000100 FFCD00 CECBD2 F1F1F1",
            nombreEquipo: "DEPORTIVO TACHIRA"
        },
        "tach/alternativa/blue": {
            codigo: "/colors blue 124 000100 FFCD00 CECBD2 F1F1F1",
            nombreEquipo: "DEPORTIVO TACHIRA"
        },
    
        // CARACAS
        "carc/titular/red": {
            codigo: "/colors red 128 FFFFFF 271B1D C72F2C C72F2C",
            nombreEquipo: "CARACAS"
        },
        "carc/titular/blue": {
            codigo: "/colors blue 128 FFFFFF 271B1D C72F2C C72F2C",
            nombreEquipo: "CARACAS"
        },
        "carc/alternativa/red": {
            codigo: "/colors red 128 000000 FFFFFF EAEAEA",
            nombreEquipo: "CARACAS"
        },
        "carc/alternativa/blue": {
            codigo: "/colors blue 128 000000 FFFFFF EAEAEA",
            nombreEquipo: "CARACAS"
        },
    
        // MONAGAS
        "mng/titular/red": {
            codigo: "/colors red 180 FFFFFF 000045 A10000 000045",
            nombreEquipo: "MONAGAS"
        },
        "mng/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 000045 A10000 000045",
            nombreEquipo: "MONAGAS"
        },
        "mng/alternativa/red": {
            codigo: "/colors red 128 000000 DDFF00",
            nombreEquipo: "MONAGAS"
        },
        "mng/alternativa/blue": {
            codigo: "/colors blue 128 000000 DDFF00",
            nombreEquipo: "MONAGAS"
        },
    
        // DEPORTIVO LARA
        "dlar/titular/red": {
            codigo: "/colors red 180 F0F0F0 E70026 302A2E E70026",
            nombreEquipo: "DEP. LARA"
        },
        "dlar/titular/blue": {
            codigo: "/colors blue 180 F0F0F0 E70026 302A2E E70026",
            nombreEquipo: "DEP. LARA"
        },
        "dlar/alternativa/red": {
            codigo: "/colors red 128 B31F2B FFFFFF",
            nombreEquipo: "DEP. LARA"
        },
        "dlar/alternativa/blue": {
            codigo: "/colors blue 128 B31F2B FFFFFF",
            nombreEquipo: "DEP. LARA"
        },
    
        // UNIVERSIDAD CESAR VALLEJO
        "ucv/titular/red": {
            codigo: "/colors red 180 FFFFFF F9591D FD6617 FD6617",
            nombreEquipo: "U. CESAR VALLEJO"
        },
        "ucv/titular/blue": {
            codigo: "/colors blue 180 FFFFFF F9591D FD6617 FD6617",
            nombreEquipo: "U. CESAR VALLEJO"
        },
        "ucv/alternativa/red": {
            codigo: "/colors red 180 FFFFFF 031B47 03173D 03173D",
            nombreEquipo: "U. CESAR VALLEJO"
        },
        "ucv/alternativa/blue": {
            codigo: "/colors blue 180 FFFFFF 031B47 03173D 03173D",
            nombreEquipo: "U. CESAR VALLEJO"
        },
    
        // CLUB DEPORTIVO UNIVERSIDAD CATOLICA
        "depuca/titular/red": {
            codigo: "/colors red 180 042544 9DCCE1 96C8E1",
            nombreEquipo: "CLUB DEP. UNIVERSIDAD CATOLICA"
        },
        "depuca/titular/blue": {
            codigo: "/colors blue 180 042544 9DCCE1 96C8E1",
            nombreEquipo: "CLUB DEP. UNIVERSIDAD CATOLICA"
        },
        "depuca/alternativa/red": {
            codigo: "/colors red 180 D9EBF4 141414 000000 141414",
            nombreEquipo: "CLUB DEP. UNIVERSIDAD CATOLICA"
        },
        "depuca/alternativa/blue": {
            codigo: "/colors blue 180 D9EBF4 141414 000000 141414",
            nombreEquipo: "CLUB DEP. UNIVERSIDAD CATOLICA"
        },
    
        // DEPORTES TOLIMA
        "deptol/titular/red": {
            codigo: "/colors red 180 BF9A4A 700A1D 771124",
            nombreEquipo: "DEPORTES TOLIMA"
        },
        "deptol/titular/blue": {
            codigo: "/colors blue 180 BF9A4A 700A1D 771124",
            nombreEquipo: "DEPORTES TOLIMA"
        },
        "deptol/alternativa/red": {
            codigo: "/colors red 90 771124 BF9A4A FFFFFF FFFFFF",
            nombreEquipo: "DEPORTES TOLIMA"
        },
        "deptol/alternativa/blue": {
            codigo: "/colors blue 90 771124 BF9A4A FFFFFF FFFFFF",
            nombreEquipo: "DEPORTES TOLIMA"
        },
    
        // INDEPENDIENTE PETROLERO
        "pet/titular/red": {
            codigo: "/colors red 180 636363 AA0515 FFFFFF AA0515",
            nombreEquipo: "INDEPENDIENTE PETROLERO"
        },
        "pet/titular/blue": {
            codigo: "/colors blue 180 636363 AA0515 FFFFFF AA0515",
            nombreEquipo: "INDEPENDIENTE PETROLERO"
        },
        "pet/alternativa/red": {
            codigo: "/colors red 90 FFFFFF 8A0D15 C6121E 8A0D15",
            nombreEquipo: "INDEPENDIENTE PETROLERO"
        },
        "pet/alternativa/blue": {
            codigo: "/colors blue 90 FFFFFF 8A0D15 C6121E 8A0D15",
            nombreEquipo: "INDEPENDIENTE PETROLERO"
        },
    
        // ALWAYS READY
        "alwr/titular/red": {
            codigo: "/colors red 33 1A1A1C FFFFFF FE323D FFFFFF",
            nombreEquipo: "ALWAYS READY"
        },
        "alwr/titular/blue": {
            codigo: "/colors blue 33 1A1A1C FFFFFF FE323D FFFFFF",
            nombreEquipo: "ALWAYS READY"
        },
        "alwr/alternativa/red": {
            codigo: "/colors red 34 FFFFFF 9F2240 D43742 9F2240",
            nombreEquipo: "ALWAYS READY"
        },
        "alwr/alternativa/blue": {
            codigo: "/colors blue 34 FFFFFF 9F2240 D43742 9F2240",
            nombreEquipo: "ALWAYS READY"
        },
    
        // FORTALEZA
        "fort/titular/red": {
            codigo: "/colors red 90 FFFFFF F91838 11328F F91838",
            nombreEquipo: "FORTALEZA"
        },
        "fort/titular/blue": {
            codigo: "/colors blue 90 FFFFFF F91838 11328F F91838",
            nombreEquipo: "FORTALEZA"
        },
        "fort/alternativa/red": {
            codigo: "/colors red 34 040A5E FAFAFA",
            nombreEquipo: "FORTALEZA"
        },
        "fort/alternativa/blue": {
            codigo: "/colors blue 34 040A5E FAFAFA",
            nombreEquipo: "FORTALEZA"
        },
    
        // RB BRAGANTINO
        "rbb/titular/red": {
            codigo: "/colors red -50 FE0302 E9E9E9 FFFFFF E9E9E9",
            nombreEquipo: "RB BRAGANTINO"
        },
        "rbb/titular/blue": {
            codigo: "/colors blue -50 FE0302 E9E9E9 FFFFFF E9E9E9",
            nombreEquipo: "RB BRAGANTINO"
        },
        "rbb/alternativa/red": {
            codigo: "/colors red -50 FFFFFF 000000 151515 000000",
            nombreEquipo: "RB BRAGANTINO"
        },
        "rbb/alternativa/blue": {
            codigo: "/colors blue -50 FFFFFF 000000 151515 000000",
            nombreEquipo: "RB BRAGANTINO"
        },
        "rbb/tercera/red": {
            codigo: "/colors red -50 FFFFFF FF1112 DE0609 FF1112",
            nombreEquipo: "RB BRAGANTINO"
        },
        "rbb/tercera/blue": {
            codigo: "/colors blue -50 FFFFFF FF1112 DE0609 FF1112",
            nombreEquipo: "RB BRAGANTINO"
        },
    
        // AMÉRICA MINEIRO
        "amcmin/titular/red": {
            codigo: "/colors red 180 FFFFFF 6EC576 27272F 6EC576",
            nombreEquipo: "AMÉRICA MINEIRO"
        },
        "amcmin/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 6EC576 27272F 6EC576",
            nombreEquipo: "AMÉRICA MINEIRO"
        },
        "amcmin/alternativa/red": {
            codigo: "/colors red 90 107837 026B2E EFEFEF FAFAFA",
            nombreEquipo: "AMÉRICA MINEIRO"
        },
        "amcmin/alternativa/blue": {
            codigo: "/colors blue 90 107837 026B2E EFEFEF FAFAFA",
            nombreEquipo: "AMÉRICA MINEIRO"
        },
        // TORINO
        "tor/titular/red": {
            codigo: "/colors red 90 FBFAF8 900A23",
            nombreEquipo: "TORINO"
        },
        "tor/titular/blue": {
            codigo: "/colors blue 90 FBFAF8 900A23",
            nombreEquipo: "TORINO"
        },
        "tor/alternativa/red": {
            codigo: "/colors red 60 A2374B F0F1F6",
            nombreEquipo: "TORINO"
        },
        "tor/alternativa/blue": {
            codigo: "/colors blue 60 A2374B F0F1F6",
            nombreEquipo: "TORINO"
        },
    
        // GENOA
        "gen/titular/red": {
            codigo: "/colors red 0 E2BF61 DB001E 262E45",
            nombreEquipo: "GENOA"
        },
        "gen/titular/blue": {
            codigo: "/colors blue 0 E2BF61 DB001E 262E45",
            nombreEquipo: "GENOA"
        },
        "gen/alternativa/red": {
            codigo: "/colors red 90 F6D903 FFFFFF F8011E 27305B",
            nombreEquipo: "GENOA"
        },
        "gen/alternativa/blue": {
            codigo: "/colors blue 90 F6D903 FFFFFF F8011E 27305B",
            nombreEquipo: "GENOA"
        },
    
        // PALERMO
        "plm/titular/red": {
            codigo: "/colors red 0 2E272E F8C6E1",
            nombreEquipo: "PALERMO"
        },
        "plm/titular/blue": {
            codigo: "/colors blue 0 2E272E F8C6E1",
            nombreEquipo: "PALERMO"
        },
        "plm/alternativa/red": {
            codigo: "/colors red 90 2F2C33 FDC7DF F0F3FA F0F3FA",
            nombreEquipo: "PALERMO"
        },
        "plm/alternativa/blue": {
            codigo: "/colors blue 90 2F2C33 FDC7DF F0F3FA F0F3FA",
            nombreEquipo: "PALERMO"
        },
    
        // CHIEVO VERONA
        "chver/titular/red": {
            codigo: "/colors red 90 0BA3EE F8C6E1 F4EF5F F4EF5F",
            nombreEquipo: "CHIEVO VERONA"
        },
        "chver/titular/blue": {
            codigo: "/colors blue 90 0BA3EE F8C6E1 F4EF5F F4EF5F",
            nombreEquipo: "CHIEVO VERONA"
        },
        "chver/alternativa/red": {
            codigo: "/colors red 0 FFFFFF 06ACFA 069DF0 06ACFA",
            nombreEquipo: "CHIEVO VERONA"
        },
        "chver/alternativa/blue": {
            codigo: "/colors blue 0 FFFFFF 06ACFA 069DF0 06ACFA",
            nombreEquipo: "CHIEVO VERONA"
        },
    
        // BARRACAS CENTRAL
        "barr/titular/red": {
            codigo: "/colors red 180 7D1622 E20613 FFFFFF E20613",
            nombreEquipo: "BARRACAS CENTRAL"
        },
        "barr/titular/blue": {
            codigo: "/colors blue 180 7D1622 E20613 FFFFFF E20613",
            nombreEquipo: "BARRACAS CENTRAL"
        },
        "barr/alternativa/red": {
            codigo: "/colors red 180 EF2233 E8E8E8 FFFFFF E8E8E8",
            nombreEquipo: "BARRACAS CENTRAL"
        },
        "barr/alternativa/blue": {
            codigo: "/colors blue 180 EF2233 E8E8E8 FFFFFF E8E8E8",
            nombreEquipo: "BARRACAS CENTRAL"
        },
        "barr/tercera/red": {
            codigo: "/colors red 180 EE4F3A 3D3F3E 768282 3D3F3E",
            nombreEquipo: "BARRACAS CENTRAL"
        },
        "barr/tercera/blue": {
            codigo: "/colors blue 180 EE4F3A 3D3F3E 768282 3D3F3E",
            nombreEquipo: "BARRACAS CENTRAL"
        },
    
        // GALES
        "gal/titular/red": {
            codigo: "/colors red 180 FFFFFF ED051F",
            nombreEquipo: "GALES"
        },
        "gal/titular/blue": {
            codigo: "/colors blue 180 FFFFFF ED051F",
            nombreEquipo: "GALES"
        },
        "gal/alternativa/red": {
            codigo: "/colors red 90 F40719 017457 F9E10F F9E10F",
            nombreEquipo: "GALES"
        },
        "gal/alternativa/blue": {
            codigo: "/colors blue 90 F40719 017457 F9E10F F9E10F",
            nombreEquipo: "GALES"
        },
    
        // AUSTRALIA
        "aus/titular/red": {
            codigo: "/colors red 90 204B44 F4C91A",
            nombreEquipo: "AUSTRALIA"
        },
        "aus/titular/blue": {
            codigo: "/colors blue 90 204B44 F4C91A",
            nombreEquipo: "AUSTRALIA"
        },
        "aus/alternativa/red": {
            codigo: "/colors red 70 FDE140 323556 1A8692 1A8692",
            nombreEquipo: "AUSTRALIA"
        },
        "aus/alternativa/blue": {
            codigo: "/colors blue 70 FDE140 323556 1A8692 1A8692",
            nombreEquipo: "AUSTRALIA"
        },
    
        // SARMIENTO DE JUNÍN
        "sar/titular/red": {
            codigo: "/colors red 90 FFFFFF 377039 2D6332 225228",
            nombreEquipo: "SARMIENTO DE JUNÍN"
        },
        "sar/titular/blue": {
            codigo: "/colors blue 90 FFFFFF 377039 2D6332 225228",
            nombreEquipo: "SARMIENTO DE JUNÍN"
        },
        "sar/alternativa/red": {
            codigo: "/colors red 90 15402F 9FD2C3 FFFFFF FFFFFF",
            nombreEquipo: "SARMIENTO DE JUNÍN"
        },
        "sar/alternativa/blue": {
            codigo: "/colors blue 90 15402F 9FD2C3 FFFFFF FFFFFF",
            nombreEquipo: "SARMIENTO DE JUNÍN"
        },
    
        // 1K
        "1k/titular/red": {
            codigo: "/colors red 60 FFFFFF E873B3 352770 352770",
            nombreEquipo: "1K"
        },
        "1k/titular/blue": {
            codigo: "/colors blue 60 FFFFFF E873B3 352770 352770",
            nombreEquipo: "1K"
        },
    
        // ANIQUILADORES FC
        "aniquiladores/titular/red": {
            codigo: "/colors red 180 110E0F CB2C37 FFFFFF CB2C37",
            nombreEquipo: "ANIQUILADORES FC"
        },
        "aniquiladores/titular/blue": {
            codigo: "/colors blue 180 110E0F CB2C37 FFFFFF CB2C37",
            nombreEquipo: "ANIQUILADORES FC"
        },
    
        // JIJANTES FC
        "jijantes/titular/red": {
            codigo: "/colors red 180 FFFFFF 01317E B50E2A 01317E",
            nombreEquipo: "JIJANTES FC"
        },
        "jijantes/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 01317E B50E2A 01317E",
            nombreEquipo: "JIJANTES FC"
        },
    
        // ULTIMATE MOSTOLES
        "mostoles/titular/red": {
            codigo: "/colors red 180 BEA06D 0A0A0C 17171C 0A0A0C",
            nombreEquipo: "ULTIMATE MOSTOLES"
        },
        "mostoles/titular/blue": {
            codigo: "/colors blue 180 BEA06D 0A0A0C 17171C 0A0A0C",
            nombreEquipo: "ULTIMATE MOSTOLES"
        },
    
        // XBUYER TEAM
        "xbuyer/titular/red": {
            codigo: "/colors red 180 EEEE65 23477A 145EAB 0A71D0",
            nombreEquipo: "XBUYER TEAM"
        },
        "xbuyer/titular/blue": {
            codigo: "/colors blue 180 EEEE65 23477A 145EAB 0A71D0",
            nombreEquipo: "XBUYER TEAM"
        },
    
        // RAYO DE BARCELONA
        "rayo/titular/red": {
            codigo: "/colors red 66 F5ED07 171717 171717 F5ED07",
            nombreEquipo: "RAYO DE BARCELONA"
        },
        "rayo/titular/blue": {
            codigo: "/colors blue 66 F5ED07 171717 171717 F5ED07",
            nombreEquipo: "RAYO DE BARCELONA"
        },
    
        // PÍO FC
        "pio/titular/red": {
            codigo: "/colors red 1 1D1D1D E4E3E8",
            nombreEquipo: "PÍO FC"
        },
        "pio/titular/blue": {
            codigo: "/colors blue 1 1D1D1D E4E3E8",
            nombreEquipo: "PÍO FC"
        },
    
        // 9Z TEAM
        "9z/titular/red": {
            codigo: "/colors red 62 FFFFFF 342971 42266F",
            nombreEquipo: "9Z TEAM"
        },
        "9z/titular/blue": {
            codigo: "/colors blue 62 FFFFFF 342971 42266F",
            nombreEquipo: "9Z TEAM"
        },
    
        // FURIA
        "furia/titular/red": {
            codigo: "/colors red 62 FFFFFF 1D2127 1D2127 61646C",
            nombreEquipo: "FURIA"
        },
        "furia/titular/blue": {
            codigo: "/colors blue 62 FFFFFF 1D2127 1D2127 61646C",
            nombreEquipo: "FURIA"
        },
    
        // ISURUS GAMING
        "isurus/titular/red": {
            codigo: "/colors red 180 000000 EBEBEB 00FFBB EBEBEB",
            nombreEquipo: "ISURUS GAMING"
        },
        "isurus/titular/blue": {
            codigo: "/colors blue 180 000000 EBEBEB 00FFBB EBEBEB",
            nombreEquipo: "ISURUS GAMING"
        },
    
        // FURIUS GAMING
        "furius/titular/red": {
            codigo: "/colors red 40 AF2268 19232B",
            nombreEquipo: "FURIUS GAMING"
        },
        "furius/titular/blue": {
            codigo: "/colors blue 40 AF2268 19232B",
            nombreEquipo: "FURIUS GAMING"
        },
    
        // TRONCOS FC
        "troncos/titular/red": {
            codigo: "/colors red 180 104D3B 07B16F FFFFFF 07B16F",
            nombreEquipo: "TRONCOS FC"
        },
        "troncos/titular/blue": {
            codigo: "/colors blue 180 104D3B 07B16F FFFFFF 07B16F",
            nombreEquipo: "TRONCOS FC"
        },
    
        // KUNISPORTS
        "kunisports/titular/red": {
            codigo: "/colors red 90 FF0165 FFFFFF 797677 191418",
            nombreEquipo: "KUNISPORTS"
        },
        "kunisports/titular/blue": {
            codigo: "/colors blue 90 FF0165 FFFFFF 797677 191418",
            nombreEquipo: "KUNISPORTS"
        },
    
        // SAIYANS FC
        "saiyans/titular/red": {
            codigo: "/colors red 56 FFFFFF 033894 E54718 E23D15",
            nombreEquipo: "SAIYANS FC"
        },
        "saiyans/titular/blue": {
            codigo: "/colors blue 56 FFFFFF 033894 E54718 E23D15",
            nombreEquipo: "SAIYANS FC"
        },
    
        // PORCINOS FC
        "porcinos/titular/red": {
            codigo: "/colors red 65 FFFFFF FFBAD4 FFBAD4 FDE7F3",
            nombreEquipo: "PORCINOS FC"
        },
        "porcinos/titular/blue": {
            codigo: "/colors blue 65 FFFFFF FFBAD4 FFBAD4 FDE7F3",
            nombreEquipo: "PORCINOS FC"
        },
    
        // EL BARRIO FC
        "barrio/titular/red": {
            codigo: "/colors red 65 FFFFFF 012168 012168 00183C",
            nombreEquipo: "EL BARRIO FC"
        },
        "barrio/titular/blue": {
            codigo: "/colors blue 65 FFFFFF 012168 012168 00183C",
            nombreEquipo: "EL BARRIO FC"
        },
    
        // DOUGLAS HAIG
        "dou/titular/red": {
            codigo: "/colors red 180 FFFFFF 000000 FF1111 000000",
            nombreEquipo: "DOUGLAS HAIG"
        },
        "dou/titular/blue": {
            codigo: "/colors blue 180 FFFFFF 000000 FF1111 000000",
            nombreEquipo: "DOUGLAS HAIG"
        },
        "dou/alternativa/red": {
            codigo: "/colors red 65 000000 FF1111 FFFFFF FFFFFF",
            nombreEquipo: "DOUGLAS HAIG"
        },
        "dou/alternativa/blue": {
            codigo: "/colors blue 65 000000 FF1111 FFFFFF FFFFFF",
            nombreEquipo: "DOUGLAS HAIG"
        }
    };
    


var currentRedKit = 0;
var currentBlueKit = 0;


// Variable para controlar si se usan mensajes con insultos
var usarMensajesExplicitos = true;
function getRandomScorerMessage() {
    // Asegurarse de que el nombre del jugador está definido
    const scorerName = game.lastKickerName || "Jugador";
    
    // Determinar arquero rival correctamente
    let arqueroRival = game.lastKickerTeam === Team.RED ? 
        (ArqueroBLUE ? ArqueroBLUE.name : "el arquero rival") : 
        (ArqueroRED ? ArqueroRED.name : "el arquero rival");
    
    // Usar los nombres de los equipos según las camisetas, asegurando que son strings
    const equipoRojo = typeof teamRed === 'object' ? (teamRed.nombreEquipo || "Equipo Rojo") : teamRed  ;
    const equipoAzul = typeof teamBlue === 'object' ? (teamBlue.nombreEquipo || "Equipo Azul") : teamBlue  ;
    
    // Determinar equipoRivalNombre según quién ha marcado
    let equipoRivalNombre = game.lastKickerTeam === Team.RED ? equipoAzul : equipoRojo;
    const scorerMessages = [
        `⚽🎉 ¡Golazo de ${scorerName}!`,
        `🔥⚽ ¡Increíble definición de ${scorerName}! ${arqueroRival} no pudo hacer nada.`,
        `💥🔥 ${scorerName} está imparable hoy, domina completamente a los de ${equipoRivalNombre}!`,
        `🤯💥⚡ ¡Qué golazo acaba de hacer ${scorerName}! ¡Espectacular!`,
        `👌⚽👏 ¡Bien definido por ${scorerName}!`,
        `🍷🚬🗿 La definición de ${scorerName} definitivamente es cine.`,
        `⚽🔥 ¡Golazo impresionante de ${scorerName}!`,
        `🔥⚽ Eduque ${scorerName}, eduque 👏👏`,
        `💪🔥⚽ Cuando sos crack, sos crack... ¡Y ${scorerName} lo acaba de demostrar! 👑`,
        `⚡⚽ ${scorerName} dejó sin opciones a ${arqueroRival} con ese disparo perfecto!`,
        `💀⚽🔥 ${equipoRivalNombre} no sabe cómo detener a ${scorerName} hoy!`,
        `🤩⚡🔥 ¡Naa, qué golazo les marcó ${scorerName} a los de ${equipoRivalNombre}! 😱⚽`,
        `🎯⚽ ¡99 de definición! ${scorerName} la puso donde quería.`,
        `💥⚽🔥 ¡Ufff, qué golazo acaba de marcarle ${scorerName} a los de ${equipoRivalNombre}! 😱⚽`,
        `👀🔥 ${scorerName} dejó en ridículo a toda la defensa de ${equipoRivalNombre} con ese golazo!`,
        `⚽👀 ¡Mirá el golazo que clavó el crack de ${scorerName}! 🔥`,
        `⚽🔥 ${scorerName} superó por completo a ${arqueroRival} con ese gol.`,
        `⚽🔥 ${scorerName} dejó sin respuesta a ${arqueroRival}.`,
        `🔥 Parece que ${scorerName} tiene la fórmula secreta contra ${equipoRivalNombre}`,
        `🔥⚽ ${scorerName} dejó sin palabras a ${equipoRivalNombre} con ese golazo.`,
        `👏🔥 Los de ${equipoRivalNombre} no pueden hacer nada contra ${scorerName} hoy.`,
        `🧤 ${arqueroRival} se estiró pero ${scorerName} fue más inteligente con ese gol.`,
        `🔥⚽ El jugador ${scorerName} está imparable contra ${equipoRivalNombre}.`,
        `👑🔥 ${scorerName} le dio una lección de fútbol a ${arqueroRival} con ese golazo.`,
        `😎🔥⚽ ¡Llegó ${scorerName} y ya empezó a mostrar su magia!`,
        `👏🔥 El arquero ${arqueroRival} no pudo hacer nada ante la brillantez de ${scorerName}.`
    ];
    
    return scorerMessages[Math.floor(Math.random() * scorerMessages.length)];
}

// Define emojis y colores para cada nivel
const playerLevels = [
    { level: 1, emoji: "🥉", color: 0xC0C0C0, minXP: 0 },     // Nivel 1 (Bronce)
    { level: 2, emoji: "🥈", color: 0xCCCCFF, minXP: 20 },    // Nivel 2 (Plata)
    { level: 3, emoji: "🥇", color: 0xFFD700, minXP: 50 },    // Nivel 3 (Oro)
    { level: 4, emoji: "💎", color: 0x00FFFF, minXP: 100 },   // Nivel 4 (Diamante)
    { level: 5, emoji: "👑", color: 0xFF55FF, minXP: 200 },   // Nivel 5 (Corona)
    { level: 6, emoji: "🔥", color: 0xFF5555, minXP: 500 },   // Nivel 6 (Fuego)
    { level: 7, emoji: "⚡", color: 0xFFFF00, minXP: 1000 },  // Nivel 7 (Rayo)
    { level: 8, emoji: "🌟", color: 0xFFAA00, minXP: 2000 },  // Nivel 8 (Estrella)
    { level: 9, emoji: "🌈", color: 0x55FF55, minXP: 5000 },  // Nivel 9 (Arcoiris)
    { level: 10, emoji: "🔮", color: 0x9900FF, minXP: 10000 } // Nivel 10 (Máximo)
];

    // Función actualizada para obtener el nivel del jugador
function getPlayerLevel(player) {
    // Obtener estadísticas del jugador
    const auth = player.auth || "unauth";
    
    // Buscar en diferentes fuentes de datos
    let stats = {};
    if (typeof statsDatabase !== 'undefined' && statsDatabase[auth]) {
        stats = statsDatabase[auth];
    } else if (typeof statsVariable !== 'undefined' && statsVariable[auth]) {
        stats = statsVariable[auth];
    }
    
    // Calcular nivel basado en estadísticas
    const games = stats.games || 0;
    const goals = stats.goals || 0;
    const assists = stats.assists || 0;
    const timePlayed = stats.timePlayed || 0;
    
    // Fórmula: 1 punto cada 5 minutos jugados + 2 puntos por gol + 1 punto por asistencia + 0.5 puntos por partido
    const points = (timePlayed / 300) + (goals * 2) + assists + (games * 0.5);
    
    // Calcular nivel: cada 10 puntos es un nivel, mínimo nivel 1
    let level = Math.max(1, Math.floor(points / 10) + 1);
    
    // Limitar nivel máximo a 100
    level = Math.min(level, 100);
    
    // Obtener emoji y color según el nivel
    const emoji = getLevelEmoji(level);
    const color = getLevelColor(level);
    
    return { level, emoji, color };
}

// Función modificada formatRoleChatMessage para incluir indicador de AFK
function formatRoleChatMessage(player, message) {
    // Obtener el rol del jugador
    let role = getRole(player);
    let rolePrefix = "";
    let messageColor = 0xFFFFFF;
    let useNegrita = false;
    
    // Obtener el nivel del jugador
    const playerLevel = getPlayerLevel(player);
    let levelDisplay = `${playerLevel.emoji} Lvl ${playerLevel.level} `;
    
    // Verificar si el jugador está AFK
    const isPlayerAFK = isAFK(player);
    let afkIndicator = isPlayerAFK ? "💤 " : ""; // Emoji ZZZ para jugadores AFK
    
    // Asignar prefijo y color según el rol
    switch (role) {
        case Role.MASTER:
            rolePrefix = `👑 MASTER ${levelDisplay}| ${afkIndicator}`;
            messageColor = 0xffb02e;
            useNegrita = true;
            break;
        case Role.OWNER:
            rolePrefix = `👑 OWNER ${levelDisplay}| ${afkIndicator}`;
            messageColor = 0xffb02e;
            useNegrita = true;
            break;
        case Role.CO_OWNER:
            rolePrefix = `⭐ CO-OWNER ${levelDisplay}| ${afkIndicator}`;
            messageColor = 0xfcd53f;
            useNegrita = true;
            break;
        case Role.SUPERADMIN:
            rolePrefix = `🔰 SUPERADMIN ${levelDisplay}| ${afkIndicator}`;
            messageColor = 0x44911b;
            useNegrita = true;
            break;
        case Role.ADMIN_PERM:
            rolePrefix = `🛡️ ADMIN ${levelDisplay}| ${afkIndicator}`;
            messageColor = 0xc2cad1;
            useNegrita = true;
            break;
        case Role.ADMIN_TEMP:
            rolePrefix = `🔧 ADMIN-TEMP ${levelDisplay}| ${afkIndicator}`;
            messageColor = 0x6c6a76;
            break;
        default:
            // Para jugadores normales, mostrar solo nivel y AFK si aplica
            rolePrefix = `${levelDisplay}${afkIndicator}`;
            messageColor = playerLevel.color;
            break;
    }
    
    // Enviar mensaje con el formato adecuado
    room.sendAnnouncement(`${rolePrefix}${player.name}: ${message}`, null, messageColor, useNegrita ? "bold" : "normal");
    return false; // Impedir que se muestre el mensaje original
}

// Función para verificar si un jugador está AFK
function isAFK(player) {
    // Si ya tienes una función isAFK implementada, úsala directamente
    if (typeof afkPlayerList !== 'undefined') {
        return afkPlayerList.some(p => p.id === player.id);
    }
    
    // Si tienes la lista de jugadores AFK en otro formato
    if (typeof afkList !== 'undefined') {
        return afkList.includes(player.id);
    }
    
    // Si guardas el estado AFK en una propiedad del jugador
    if (player.afk) {
        return true;
    }
    
    // Si no tienes implementado el sistema AFK, retornar false
    return false;
}

// Función para quitar el estado AFK a un jugador
function removeAFK(player) {
    // Si ya tienes una función removeAFK implementada, úsala directamente
    if (typeof removePlayerAFK === 'function') {
        removePlayerAFK(player);
        return;
    }
    
    // Si usas una lista de IDs de jugadores AFK
    if (typeof afkList !== 'undefined') {
        afkList = afkList.filter(id => id !== player.id);
        return;
    }
    
    // Si usas una lista de objetos jugador AFK
    if (typeof afkPlayerList !== 'undefined') {
        afkPlayerList = afkPlayerList.filter(p => p.id !== player.id);
        return;
    }
    
    // Si guardas el estado AFK en una propiedad del jugador
    if (player.afk) {
        player.afk = false;
    }
}

function getRandomOwnGoalScorerMessage() {
    // Asegurarse de que el nombre del jugador está definido
    const scorerName = game.lastKickerName || "Jugador";
    
    // Usar los nombres de los equipos según las camisetas, asegurando que son strings
    const equipoRojo = typeof teamRed === 'object' ? (teamRed.nombreEquipo || "Equipo Rojo") : teamRed || "Equipo Rojo";
    const equipoAzul = typeof teamBlue === 'object' ? (teamBlue.nombreEquipo || "Equipo Azul") : teamBlue || "Equipo Azul";
    
    // Determinar nombres de equipos según quién marcó en propia
    let equipoRivalNombre = game.lastKickerTeam === Team.RED ? equipoAzul : equipoRojo;
    let equipoPropioNombre = game.lastKickerTeam === Team.RED ? equipoRojo : equipoAzul;
    
    // Determinar arqueros
    let arqueroRival = game.lastKickerTeam === Team.RED ? 
        (ArqueroBLUE ? ArqueroBLUE.name : "el arquero rival") : 
        (ArqueroRED ? ArqueroRED.name : "el arquero rival");
    
    let arqueroPropio = game.lastKickerTeam === Team.RED ? 
        (ArqueroRED ? ArqueroRED.name : "el arquero propio") : 
        (ArqueroBLUE ? ArqueroBLUE.name : "el arquero propio");

        const ownGoalScorerMessages = [
            `🤣 ${scorerName} Seguí así chad que vas a llegar muy cerca.🤦‍♂️`,
            `🤣 ${scorerName} Tenés que abrir el estadio, los burros hacen eso.🤦‍♂️`,
            `😵‍💫 Pero dale ${scorerName}, ¿tan quemado estás que la mandaste a tu propio arco? 🎯🤦‍♂️`,
            `🔥 Che, ${scorerName}, ¡la idea era hacer goles en el otro arco, master! 💀`,
            `💯 ${scorerName} vio un TikTok de "cómo NO jugar al haxball" y le salió de 10.`,
            `🔥 ${scorerName} es el jugador que todos queremos en el equipo... del rival.`,
            `🤨 ${scorerName}: "Quería probar si nuestro arquero estaba atento"`,
        ];
  
  
    return ownGoalScorerMessages[Math.floor(Math.random() * ownGoalScorerMessages.length)];
}
function handleReinicioComando(player) {
    // Si es ADMIN_PERM o superior, reiniciar inmediatamente
    if (hasPermission(player, Role.ADMIN_PERM)) {
        room.sendAnnouncement("🔄 El partido se reiniciará ahora.", null, 0x00FF00, "bold", 2);
        room.stopGame();
        room.startGame();
        return true;
    }
    
    // Si es ADMIN_TEMP, solo permitir reinicio cuando el juego está detenido
    if (hasPermission(player, Role.ADMIN_TEMP) && getRole(player) < Role.ADMIN_PERM) {
        if (gameState === State.STOP) {
            room.sendAnnouncement("🔄 El partido se reiniciará ahora.", null, 0x00FF00, "bold", 2);
            room.stopGame();
            room.startGame();
            return true;
        } else {
            room.sendAnnouncement("[❌] Solo puedes reiniciar cuando el juego está detenido.", player.id, 0xFF0000, "bold", 2);
            return true;
        }
    }

    // Para jugadores normales, sistema de votación
    // Si no hay solicitud pendiente, crear una nueva
    if (!reinicioSolicitado) {
        reinicioSolicitado = true;
        jugadorSolicitanteReinicio = player.id;
        equipoSolicitanteReinicio = player.team;
        room.sendAnnouncement(`${player.name} ha solicitado reiniciar el partido. Se necesitan dos confirmaciones del equipo contrario escribiendo !rr.`, null, 0xFFFF00, "bold", 2);
        return true;
    }
    
    // Si ya existe una solicitud, verificar si es del equipo contrario
    if (player.team !== equipoSolicitanteReinicio && player.team !== Team.SPECTATORS) {
        // Verificar que no haya confirmado ya
        if (!confirmacionesReinicio.includes(player.id)) {
            confirmacionesReinicio.push(player.id);
            room.sendAnnouncement(`${player.name} ha confirmado el reinicio del partido (${confirmacionesReinicio.length}/2).`, null, 0xFFFF00, "bold", 2);
            
            // Si hay suficientes confirmaciones, reiniciar
            if (confirmacionesReinicio.length >= 2) {
                room.sendAnnouncement("🔄 El partido se reiniciará ahora.", null, 0x00FF00, "bold", 2);
                room.stopGame();
                room.startGame();
                
                // Reiniciar variables
                reinicioSolicitado = false;
                jugadorSolicitanteReinicio = null;
                equipoSolicitanteReinicio = null;
                confirmacionesReinicio = [];
            }
        } else {
            room.sendAnnouncement(`[❌] Ya has confirmado el reinicio del partido.`, player.id, 0xFF0000, "bold", 2);
        }
        return true;
    } else if (player.id === jugadorSolicitanteReinicio) {
        room.sendAnnouncement(`[❌] Ya has solicitado el reinicio del partido.`, player.id, 0xFF0000, "bold", 2);
        return true;
    } else if (player.team === equipoSolicitanteReinicio) {
        room.sendAnnouncement(`[❌] Solo los jugadores del equipo contrario pueden confirmar el reinicio.`, player.id, 0xFF0000, "bold", 2);
        return true;
    } else if (player.team === Team.SPECTATORS) {
        room.sendAnnouncement(`[❌] Los espectadores no pueden confirmar el reinicio del partido.`, player.id, 0xFF0000, "bold", 2);
        return true;
    }
    
    return false;
}
// Modificar la función obtenerCamiseta
function obtenerCamiseta(equipoClave) {
    let equipo = camisetasEquipos[equipoClave];
    if (!equipo) {
        room.sendAnnouncement(`[❌] Equipo no encontrado: ${equipoClave}`, null, 0xFF0000, "bold", 2);
        return null;
    }

    let datos = parseColors(equipo.codigo);
    
    // Actualizamos las variables globales
    if (equipoClave.includes("red")) {
        redAngle = datos.angle;
        redTextColor = datos.textColor;
        redColor = datos.colors;
        teamRedName = equipo.nombreEquipo; // Usar teamRedName en lugar de teamRed
    } else if (equipoClave.includes("blue")) {
        blueAngle = datos.angle;
        blueTextColor = datos.textColor;
        blueColor = datos.colors;
        teamBlueName = equipo.nombreEquipo; // Usar teamBlueName en lugar de teamBlue
    }

    return {
        angle: datos.angle,
        textColor: datos.textColor,
        colors: datos.colors,
        nombreEquipo: equipo.nombreEquipo
    };
}

// Función para seleccionar un partido aleatorio
function seleccionarPartidoAleatorio() {
    // Calcular el total de "demanda" de todos los partidos
    var totalDemanda = 0;
    for (var i = 0; i < opciones.length; i++) {
        totalDemanda += opciones[i].demanda;
    }
    
    // Seleccionar un número aleatorio dentro del rango de la demanda total
    var seleccion = Math.floor(Math.random() * totalDemanda);
    
    // Encontrar qué partido corresponde a la selección
    var acumulado = 0;
    for (var i = 0; i < opciones.length; i++) {
        acumulado += opciones[i].demanda;
        if (seleccion < acumulado) {
            return opciones[i];
        }
    }
    
    // En caso de fallo, devolver el primer partido
    return opciones[0];
}

// Función para aplicar un partido aleatorio al inicio del juego
// Modificar la función aplicarCamisetasAleatorias
function aplicarCamisetasAleatorias() {
    var partidoSeleccionado = seleccionarPartidoAleatorio();
    console.log("Aplicando partido:", partidoSeleccionado);
    
    try {
        partidoSeleccionado.partido();
        console.log("✅ Camisetas aplicadas: Rojo =" + teamRedName + ", Azul = " + teamBlueName);
    } catch (error) {
        console.error("❌ Error al aplicar camisetas:", error);
        
        // En caso de error, aplicar camisetas predeterminadas
        room.setTeamColors(Team.RED, 30, 0x231f20, [0xffffff, 0xee1b2c, 0xffffff]);
        room.setTeamColors(Team.BLUE, 90, 0xFFFFFF, [0x033f86, 0xfab900, 0x033f86]);
        teamRedName = "RIVER PLATE";
        teamBlueName = "BOCA JRS.";
    }
}

// Función para aplicar un partido específico por su índice
function aplicarPartidoEspecifico(indice) {
    if (indice >= 0 && indice < opciones.length) {
        try {
            opciones[indice].partido();
            console.log("✅ Camisetas aplicadas: Rojo =" + teamRed + ", Azul = " + teamBlue);
            return true;
        } catch (error) {
            console.error("❌ Error al aplicar partido específico:", error);
            return false;
        }
    } else {
        console.error("❌ Índice de partido inválido:", indice);
        return false;
    }
}
// Mejorar la función para listar camisetas
function listarCamisetasDisponibles(player, teamColor) {
    var color = teamColor.toLowerCase();
    if (color !== 'red' && color !== 'blue') {
        console.error("Color de equipo no válido:", color);
        return;
    }
    
    var colorBuscar = "/" + color;
    var camisetas = Object.keys(camisetasEquipos).filter(key => key.includes(colorBuscar));
    
    console.log(`Listando camisetas para ${color}:`, camisetas);
    
    if (camisetas.length === 0) {
        room.sendAnnouncement(
            `No hay camisetas disponibles para el equipo ${color === 'red' ? 'rojo' : 'azul'}.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return;
    }
    
    var mensaje = `Camisetas disponibles para equipo ${color === 'red' ? 'rojo' : 'azul'}:\n`;
    
    for (var i = 0; i < camisetas.length; i++) {
        var key = camisetas[i];
        var nombreEquipo = camisetasEquipos[key].nombreEquipo || "Desconocido";
        mensaje += `${i+1}. ${nombreEquipo}\n`;
    }
    
    room.sendAnnouncement(
        mensaje,
        player.id,
        infoColor,
        'bold',
        HaxNotification.CHAT
    );
}
function UEFAFun(player) { // !camisetas
    room.sendAnnouncement("UEFA 🌍: !premierleague ✦ !ligue1 ✦  !bundesliga ✦ !seriea ✦ !serieb ✦ !laliga ✦ !eredivisie ✦ !primeiraliga ✦ !superlig ✦ !campeonatoruso ✦ !1hnl ✦ !premierucrania  !superligasuiza ✦ !nb1 ", player.id, 0xea9999, "bold", 0);
}
function CONMEBOLFun(player) { // !camisetas
    room.sendAnnouncement("CONMEBOL 🌎: !primera ✦ !ascenso ✦ !brasileirao ✦ !campeonatouruguayo ✦ !ligaparaguaya ✦ !ligaaguila ✦ !ligapro ✦ !liga1peru ✦ !campeonatochileno ✦ !ligaboliviana ✦ !ligavenezolana", player.id, 0xa4c2f4, "bold", 0);
}
function CONCACAFFun(player) { // !camisetas
    room.sendAnnouncement("CONCACAF 🌎: !ligamx ✦ !mls", player.id, 0xffd966, "bold", 0);
}


function CamisetasFun(player) { // !camisetas
    room.sendAnnouncement("!UEFA 🌍✦ !CONMEBOL 🌎✦ !CONCACAF 🌎✦ !paises 🌐✦ !fantasmas  👻 ✦ !amateurs 🛡✦ !superheroes 🦸 | !haxball | !esports", player.id, 0xb4a7d6, "bold", 0);
    setTimeout(function() {
      var paso1 = "📢 ¡Hola! ¿Quieres jugar con la camiseta de tu equipo favorito? Es muy fácil, sigue estos pasos:\n\n";
      paso1 += "1️⃣ Escribe las letras abreviadas de tu equipo (por ejemplo, riv para River Plate, boc para Boca Juniors, arg para Argentina, bra para Brasil, etc.) 🏟️";
      room.sendAnnouncement(paso1, player.id, 0xffffff, "bold", 0);
    }, 5000);

    setTimeout(function() {
      var paso2 = "2️⃣ Luego, escribe qué tipo de camiseta deseas (titular, alternativa, tercera, clásica o bandera para selecciones nacionales) 🌟";
      room.sendAnnouncement(paso2, player.id, 0xffffff, "bold", 0);
    }, 8000);

    setTimeout(function() {
      var paso3 = "3️⃣ Por último, elige si quieres la camiseta para el equipo rojo 🔴 (red) o azul 🔵(blue)";
      room.sendAnnouncement(paso3, player.id, 0xffffff, "bold", 0);
    }, 11000);

    setTimeout(function() {
      var ejemplo = "\nPor ejemplo, si quieres ver la camiseta titular de River Plate en el equipo rojo, escribe: riv/titular/red";
      ejemplo += "\nSi quieres la camiseta titular de Boca Juniors en el equipo azul, escribe: boc/titular/blue";
      ejemplo += "\nRecuerda poner el símbolo '/' entre cada parte del comando.";
      room.sendAnnouncement(ejemplo, player.id, 0xffffff, "bold", 0);
    }, 14000);

    setTimeout(function() {
      var final = "\n¡Y listo! 🎉 Verás la camiseta del equipo que elegiste en el equipo que quieras. ¡Disfruta representando a tu equipo favorito! ⚽️👕";
      room.sendAnnouncement(final, player.id, 0xffffff, "bold", 0);
    }, 17000);
}

function SuperHeroesFun(player) { // !fantasmas
    room.sendAnnouncement("💪 SUPERHÉROES: ", player.id, 0xfaebd6, "bold", 0);
    room.sendAnnouncement("MARVEL: SPIDERMAN | HULK | CAPITANAMERICA", player.id, 0xfaebd6, "bold", 0);
    room.sendAnnouncement("DC: BATMAN", player.id, 0xfaebd6, "bold", 0);
}

function FantasmasFun(player) { // !fantasmas
    room.sendAnnouncement("📜 👻 EQUIPOS FANTASMAS: ", player.id, 0xfaebd6, "bold", 0);
    room.sendAnnouncement("🌍 exSelecciones:  | URSS | YUG | CZE", player.id, 0xfaebd6, "bold", 0);
    room.sendAnnouncement("🛡 exClubes: | ALU | LOA | OCFC | BAC | ROAC | CAPORT", player.id, 0xfaebd6, "bold", 0);
}

function SuperligaFun(player) { // !superliga
    room.sendAnnouncement("🅰 PRIMERA DIVISIÓN: | RIV | BOC | RAC | IND | SLO | EST | VEL | LAN | DYJ", player.id, 0xADF4FF, "bold", 0); 
    room.sendAnnouncement(" | AAAJ | NOB | CEN | ARSE | BAND | TAL | CSF | HUR | GIM ", player.id, 0xADF4FF, "bold", 0); 
    room.sendAnnouncement(" | UNI | ALD | ATU | CCS | GOD | PAT | BARR | TIG | PLA | SAR", player.id, 0xADF4FF, "bold", 0); 
}

function AscensoFun(player) { // !ascenso
    room.sendAnnouncement('🅱 ASCENSO: | ALB | FCO | CHA | ATL |  SMT | OLP | BEL | QUI | MOR | NCH | ALM | SMSJ | ABROWN', player.id, 0xDB1414, "bold", 0); 
    room.sendAnnouncement('| DOC | SCH | RIE | AGR | ALV | STEL​ | MER | AdQ | CJA | GyT | CADU | VSC | EBA | BOCHZ | CDE | SIT | MDY | CDN | LAF | SM | DOU', player.id, 0xDB1414, "bold", 0); 
}

function EquiposAmateursFun(player) { // !ascenso
    room.sendAnnouncement('🔰 AMATEURS (LIGAS BARRIALES) : | CDYBGR', player.id, 0xDB1414, "bold", 0); 
}

function CampeonatoChilenoFun(player) { // !campeonatochileno
    room.sendAnnouncement("(🇨🇱) CAMPEONATO CHILENO:  | CCO | UDC | UCA | CDP | COB | EVDM | ULC |", player.id, 0xFF2A12, "bold", 0); 
    room.sendAnnouncement("| AUD | HUA | IQU | OHI | UES | SWA | CUR | CDA | UCON | DLS | COQ", player.id, 0xFF2A12, "bold", 0); 
}

function LigaBolivianaFun(player) { // !ligaboliviana
    room.sendAnnouncement("(🇧🇴) LIGA BOLIVIANA:  | BLV | STG | WTM | PET | ALWR", player.id, 0x5ACC31, "bold", 0); 
}

function MLSFun(player) { // !mls
    room.sendAnnouncement("(🇺🇸) MLS: | LA | TOFC | NYC | ATLU | LAFC | SEA | NYRB | PTIM | ORL | MIA", player.id, 0x1930FF, "bold", 0); 
}

function LigaUruguayaFun(player) { // !campeonatouruguayo
    room.sendAnnouncement('(🇺🇾) CAMPEONATO URUGUAYO: | NAC | PEN | DAN | RAM | RIU | WAN | MCT | CRL | DFS | PCOL', player.id, 0x69CDFF, "bold", 0); 
}

function CampeonatoRusoFun(player) { // !campeonatoruso
    room.sendAnnouncement('(🇷🇺) CAMPEONATO RUSO: | SPM | CSK | ZEN | LOK | DIN', player.id, 0xe11a22, "bold", 0); 
}

function PremierUcranianaFun(player) { // !premierucrania
    room.sendAnnouncement('(🇺🇦) LIGA PREMIER UCRANIA: | SHA | DYK | NYV', player.id, 0xFFF954, "bold", 0); 
}

function LaLigaFun(player) { // !laliga
    room.sendAnnouncement('(🇪🇸) LALIGA: | RMA | BAR | ATM | SEV | VIL | VAL | ATH | GET | CEL | BET | LEV | RAY | RCDE | MLL', player.id, 0xFF2A00, "bold", 0); 
}

function LigaAguilaFun(player) { // !ligaaguila
    room.sendAnnouncement('(🇨🇴) LIGA ÁGUILA: | ATN | MIL | AME | SFE | CAL | ONC | DEPTOL', player.id, 0xFFE959, "bold", 0); 
}

function LigaParaguayaFun(player) { // !ligaparaguaya
    room.sendAnnouncement('(🇵🇾) LIGA PARAGUAYA: | CCP | OLI | GUA | LIB', player.id, 0xa3a3a3, "bold", 0);
}

function SerieATIMFun(player) { // !seriea
    room.sendAnnouncement('(🇮🇹) SERIE A: | JUV | INT | ACM | ATA | NAP | LAZ | ROM | FIO | TOR | GEN | PLM | CHVER', player.id, 0x6699FF, "bold", 0);
}

function SerieBItaliaFun(player) { // !seriea
    room.sendAnnouncement('(🇮🇹) SERIE B: | VENFC', player.id, 0x6699FF, "bold", 0);
}

function BrasilLeagueFun(player) { // !brasileirão
    room.sendAnnouncement('(🇧🇷) BRASILEIRAO: SAO | SAN | CRU | FLA | PAL | CAM | SCI | GRE | COR | BOT | PAR | FLU | VAS | FORT | RBB | AMCMIN', player.id, 0xF7FF19, "bold", 0);
}

function PremierLeagueFun(player) { // !premierleague
    room.sendAnnouncement('(🇬🇧) PREMIER LEAGUE: MCI | LIV | CHE | MUN | TOT | LEI | ARS | EVE | WHU | WOL | AVL | NEW | SOU | WAT | CRY | LEE | FUL | WBA | HUL', player.id, 0xFFFFFF, "bold", 0); 
}

function SuperLigFun(player) { // !superlig
    room.sendAnnouncement('(🇹🇷) SUPER LIG: | GS | FB | BJK ', player.id, 0xFA0000, "bold", 0); 
}

function LigaVenezolanaFun(player) { // !ligavenezolana
    room.sendAnnouncement('(🇻🇪) Liga Venezolana: TACH | CARC | MNG | DLAR', player.id, 0xF7FF19, "bold", 0);
}

function PaisesFun(player) { // !paises
    room.sendAnnouncement('🌍 EUROPA: FRA | ALE | ITA | ESP | ING | BELG | POR | HOL | CRO | | GAL | RUS | SWE | SUI | AUT | UKR | POL | MAR | SRB | TUN | DEN', player.id, 0x5793FA, "bold", 0);  
    room.sendAnnouncement('🌎 AMÉRICA: BRA | ARG | COL | URU | CHI | USA  | MEX | ECU | PGY | PER | VEN | BOL | CAN | CRC', player.id, 0x5793FA, "bold", 0);  
    room.sendAnnouncement('🌏 ASIA y OCEANIA: JAP | QAT | CNO | NZE | IRN | KOR | KSA | AUS', player.id, 0x5793FA, "bold", 0); 
    room.sendAnnouncement('🌍 AFRICA: NGA | CDM | CMR | SEN | GHA', player.id, 0x5793FA, "bold", 0); 
}

function BundesligaFun(player) { // !bundesliga
    room.sendAnnouncement('(🇩🇪) BUNDESLIGA: | FCB | BVB | RBL | B04 | HSV', player.id, 0xF5FAF8, "bold", 0); 
}

function EredivisieFun(player) { // !eredivisie
    room.sendAnnouncement('(🇳🇱) EREDIVISIE: | AJA | FEY | PSV | WIL', player.id, 0xFA6400, "bold", 0); 
} 

function Ligue1Fun(player) { // !ligue1
    room.sendAnnouncement('(🇫🇷) LIGUE 1: | PSG | OGC | OM | OL | ASM | FCN | REN | STE', player.id, 0x3744FA, "bold", 0); 
}

function LigaMXFun(player) { // !ligamx
    room.sendAnnouncement('(🇲🇽) LIGA MX: | AMC | CHV | CRUZ | TGS | MTY', player.id, 0x75FF59, "bold", 0); 
} 

function LigaProFun(player) { // !ligapro
    room.sendAnnouncement('(🇪🇨) LIGA PRO: | LDU | BSC | EME | IDV | DEPUCA', player.id, 0xFAFF5C, "bold", 0); 
}

function RaiffeisenSuperLeagueFun(player) { // !superligasuiza
    room.sendAnnouncement('(🇨🇭) RAIFFEISEN SUPER LEAGUE: | BAS | ', player.id, 0xFF0A0A, "bold", 0); 
}

function Liga1PeruFun(player) { // !liga1peru
    room.sendAnnouncement('(🇵🇪) LIGA 1: | UNV | ALI | CRI | MEL | UCV', player.id, 0xFF1C1C, "bold", 0); 
}

function PrimeiraLigaFun(player) { // !primeiraliga
    room.sendAnnouncement('(🇵🇹) Primeira Liga: | BEN | SPO | FCP | SCB', player.id, 0xFF3B3B, "bold", 0); 
}

function EquiposEsportsFun(player) { // !esports
    room.sendAnnouncement("(🎮) EQUIPOS ESPORTS:  | FURIA | ISURUS | 9Z | KUNISPORT | TRONCOS | PORCINOS | SAIYANS | BARRIO | ANIQUILADORES |", player.id, 0x00FF00, "bold", 0); 
    room.sendAnnouncement("| JIJANTES | MOSTOLES | RAYO | XBUYER | 1K | FURIUS | PIO |", player.id, 0x00FF00, "bold", 0); 
    return false;
}

function parseColors(colors) {
    console.log("parseColors recibió:", colors);
    
    if (!colors || typeof colors !== 'string') {
        console.error("Error: parseColors recibió un valor inválido:", colors);
        return null;
    }
    
    try {
        // Eliminar espacios en blanco y dividir por comas
        var colorsArray = colors.replace(/\s+/g, '').split(',');
        
        // Verificar que hay al menos un color
        if (colorsArray.length === 0) {
            console.error("No se encontraron colores en:", colors);
            return null;
        }
        
        // Convertir cada color a un objeto válido
        var result = colorsArray.map(function(color) {
            // Si es un número, convertirlo a número
            if (!isNaN(color) && color.trim() !== '') {
                return parseInt(color, 10);
            }
            
            // Si es hexadecimal, convertirlo a número
            if (color.startsWith('0x') || color.startsWith('#')) {
                var hex = color.replace('#', '0x');
                return parseInt(hex, 16);
            }
            
            // Si es nombre de color, mantenerlo como string
            return color;
        });
        
        console.log("Colores parseados:", result);
        return result;
    } catch (error) {
        console.error("Error al analizar colores:", error, "Input:", colors);
        return null;
    }
}

function asignarCamisetaPorClave(clave) {
    console.log("Intentando asignar camiseta con clave:", clave);
    
    // Verificar si la clave existe
    if (!camisetasEquipos[clave]) {
        console.error("❌ No se encontró la camiseta con clave:", clave);
        return false;
    }
    
    var camiseta = camisetasEquipos[clave];
    console.log("Datos de la camiseta:", camiseta);
    
    // Verificar que la camiseta tenga el código
    if (!camiseta.codigo) {
        console.error("❌ La camiseta no tiene código:", camiseta);
        return false;
    }
    
    try {
        // Parsear el código de colores
        // Formato esperado: "/colors [red|blue] [angle] [textColor] [color1] [color2] ..."
        var partes = camiseta.codigo.split(' ');
        
        if (partes.length < 5) {
            console.error("❌ Formato de código inválido:", camiseta.codigo);
            return false;
        }
        
        // Determinar el equipo (red o blue)
        var equipoStr = partes[1].toLowerCase();
        var equipo = equipoStr === 'red' ? Team.RED : Team.BLUE;
        
        // Obtener el ángulo
        var angulo = parseInt(partes[2], 10);
        
        // Obtener el color del texto (convertir hex a número)
        var colorTexto = parseInt("0x" + partes[3], 16);
        
        // Obtener los colores (convertir hex a número)
        var colores = [];
        for (var i = 4; i < partes.length; i++) {
            colores.push(parseInt("0x" + partes[i], 16));
        }
        
        console.log("Aplicando colores:");
        console.log("Equipo:", equipo);
        console.log("Ángulo:", angulo);
        console.log("Color de texto:", colorTexto);
        console.log("Colores:", colores);
        
        // Aplicar los colores
        room.setTeamColors(equipo, angulo, colorTexto, colores);
        
        // Actualizar el nombre del equipo según la camiseta
        if (equipoStr === 'red') {
            teamRed = camiseta.nombreEquipo || "EQUIPO LOCAL";
            console.log("✅ Nombre del equipo rojo actualizado a:", teamRed);
        } else {
            teamBlue = camiseta.nombreEquipo || "EQUIPO VISITANTE";
            console.log("✅ Nombre del equipo azul actualizado a:", teamBlue);
        }
        
        console.log(`✅ Camiseta aplicada para equipo ${equipoStr}: ${camiseta.nombreEquipo || clave}`);
        return true;
    } catch (error) {
        console.error("❌ Error al aplicar los colores del equipo:", error);
        console.error("Detalles del error:", error.stack);
        return false;
    }
}
function kitCommandRed(player, message) {
    if (getRole(player) < Role.ADMIN_TEMP) {
        room.sendAnnouncement(
            "❌ No tienes permisos para cambiar las camisetas.",
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return false;
    }
    
    var msgArray = message.split(/ +/).slice(1);
    
    // Si no hay argumentos, avanza a la siguiente camiseta
    if (msgArray.length === 0) {
        setKit(Team.RED, currentRedKit + 1);
        return false;
    }
    
    var camisetaId = msgArray.join(' ');
    console.log("Comando !redkit recibido con parámetro:", camisetaId);
    
    // DEPURACIÓN: Mostrar todas las claves disponibles
    console.log("Claves en camisetasEquipos:", Object.keys(camisetasEquipos));
    
    // Si es un número, buscar por índice
    if (!isNaN(camisetaId) && camisetaId.trim() !== '') {
        var index = parseInt(camisetaId) - 1;
        console.log("Buscando por índice:", index);
        setKit(Team.RED, index);
        return false;
    }
    
    // Intentar búsqueda directa
    console.log("¿Existe la clave '" + camisetaId + "'?", camisetasEquipos[camisetaId] ? "Sí" : "No");
    
    // Intentar con /red al final si no lo tiene ya
    if (!camisetaId.endsWith("/red")) {
        const claveConRed = camisetaId + "/red";
        console.log("¿Existe la clave '" + claveConRed + "'?", camisetasEquipos[claveConRed] ? "Sí" : "No");
        
        if (camisetasEquipos[claveConRed]) {
            console.log("Encontrada clave con /red añadido:", claveConRed);
            asignarCamisetaPorClave(claveConRed);
            return false;
        }
    }
    
    // Buscar por coincidencia parcial
    var camisetasRojas = Object.keys(camisetasEquipos).filter(k => k.includes("/red"));
    console.log("Camisetas rojas disponibles:", camisetasRojas);
    
    // Clave que contiene la búsqueda
    var coincidencias = camisetasRojas.filter(k => k.toLowerCase().includes(camisetaId.toLowerCase()));
    console.log("Coincidencias encontradas:", coincidencias);
    
    if (coincidencias.length > 0) {
        console.log("Usando primera coincidencia:", coincidencias[0]);
        asignarCamisetaPorClave(coincidencias[0]);
        return false;
    }
    
    // Si llegamos aquí, no se encontró
    room.sendAnnouncement(
        `❌ No se encontró ninguna camiseta con el identificador "${camisetaId}".`,
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
    );
    
    // Mostrar algunas opciones disponibles
    if (camisetasRojas.length > 0) {
        let sugerencias = camisetasRojas.slice(0, 5).map(k => k.split('/')[0]).join(', ');
        room.sendAnnouncement(
            `Algunas opciones: ${sugerencias}`,
            player.id,
            infoColor,
            'bold',
            HaxNotification.CHAT
        );
    }
    
    return false;
}


function setKit(team, kitIndex) {
    // Verificar si camisetasEquipos existe y tiene claves
    if (!camisetasEquipos || Object.keys(camisetasEquipos).length === 0) {
        console.error("camisetasEquipos no está definido o está vacío");
        return false;
    }
    
    // Buscar todas las camisetas para el equipo correspondiente
    var colorBuscar = team === Team.RED ? "/red" : "/blue";
    var camisetasEquipo = Object.keys(camisetasEquipos).filter(key => key.includes(colorBuscar));
    
    console.log(`Buscando camisetas para equipo ${team === Team.RED ? "rojo" : "azul"}`);
    console.log("Color a buscar:", colorBuscar);
    console.log("Camisetas encontradas:", camisetasEquipo);
    
    if (camisetasEquipo.length === 0) {
        console.error(`No hay camisetas para el equipo ${team === Team.RED ? "rojo" : "azul"}`);
        return false;
    }
    
    // Asegurarse de que el índice sea válido
    if (isNaN(kitIndex) || kitIndex < 0) {
        kitIndex = 0;
    }
    
    if (kitIndex >= camisetasEquipo.length) {
        kitIndex = kitIndex % camisetasEquipo.length;
    }
    
    // Obtener la clave de la camiseta
    var camisetaKey = camisetasEquipo[kitIndex];
    console.log(`Seleccionando camiseta con clave: ${camisetaKey}, índice: ${kitIndex}`);
    
    // Asignar la camiseta
    var resultado = asignarCamisetaPorClave(camisetaKey);
    console.log("Resultado de asignación:", resultado);
    
    // Guardar el índice actual
    if (team === Team.RED) {
        currentRedKit = kitIndex;
        console.log("currentRedKit actualizado a:", kitIndex);
    } else {
        currentBlueKit = kitIndex;
        console.log("currentBlueKit actualizado a:", kitIndex);
    }
    
    return resultado;
}



function toggleSwapColors() {
    cambioCami = !cambioCami;
    if (cambioCami) {
        room.sendAnnouncement("🔄👕 Cambio de Camisetas Automático ACTIVADO ✅", null, 0x00ff5e, "bold", 2);
    } else {
        room.sendAnnouncement("🔄👕 Cambio de Camisetas Automático DESACTIVADO ❌", null, 0xff363e, "bold", 2);
    }
}

function showPasswordsCommand(player) {
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("No tienes permisos para ver las contraseñas.", player.id, 0xFF0000);
        return false;
    }
    
    room.sendAnnouncement(`Contraseñas actuales:`, player.id, 0xFFFF00);
    room.sendAnnouncement(`SUPERADMIN: ${rolPasswords.SUPERADMIN}`, player.id, 0xFFFF00);
    room.sendAnnouncement(`CO-OWNER: ${rolPasswords.CO_OWNER}`, player.id, 0xFFFF00);
    room.sendAnnouncement(`OWNER: ${rolPasswords.OWNER}`, player.id, 0xFFFF00);
    
    return false;
}


function shuffleOptions() {
    // Crear una lista ponderada de opciones en función de la demanda
    let weightedOptions = [];
    
    // Agregar los partidos tantas veces como su demanda
    opciones.forEach(option => {
        // Usamos directamente la demanda para determinar cuántas veces agregar la opción
        // La demanda va de 1 a 100, los más cercanos a 100 se agregarán más veces
        for (let i = 0; i < option.demanda; i++) {
            weightedOptions.push(option);
        }
    });

    // Mezclar las opciones ponderadas dos veces aleatoriamente
    let selectedOption = null;

    do {
        // Primera mezcla aleatoria
        weightedOptions.sort(function () {
            return 0.5 - Math.random();
        });

        // Segunda mezcla aleatoria
        weightedOptions.sort(function () {
            return 0.5 - Math.random();
        });

        // Seleccionamos el primer partido de la lista aleatoria
        selectedOption = weightedOptions[0];

    } while (lastFiveGames.includes(selectedOption) && lastFiveGames.length >= 5); // Verificamos que no haya estado en los últimos 5

    // Ejecutar el partido seleccionado
    selectedOption.partido();

    // Añadir el partido seleccionado a los últimos 5 partidos
    lastFiveGames.push(selectedOption);

    // Si hay más de 5 partidos en el array, eliminamos el más antiguo
    if (lastFiveGames.length > 5) {
        lastFiveGames.shift();
    }
}
// Usar tu función shuffleTeams existente
function shuffleTeams() {
    const players = room.getPlayerList();
  
    // Filtrar jugadores activos y asignar a los equipos
    const activePlayers = players.filter(player => !player.spectator);
    const team1Players = activePlayers.filter(player => player.team === 1);
    const team2Players = activePlayers.filter(player => player.team === 2);
  
    // Mezclar los jugadores de los equipos
    const shuffledPlayers = shuffleArray(team1Players.concat(team2Players));
  
    // Asignar los jugadores a los equipos de forma alternativa
    const totalPlayers = shuffledPlayers.length;
    const halfPlayers = Math.floor(totalPlayers / 2);
  
    for (let i = 0; i < totalPlayers; i++) {
      const player = shuffledPlayers[i];
      const team = (i < halfPlayers) ? 1 : 2;
      room.setPlayerTeam(player.id, team);
    }
  
    // Colocar los jugadores restantes como espectadores
    const remainingPlayers = players.filter(player => !activePlayers.includes(player));
    for (const player of remainingPlayers) {
      room.setPlayerTeam(player.id, 0); // 0 representa el equipo de espectadores
    }
  
    room.sendAnnouncement(
        "🎲 ¡Los equipos han sido mezclados aleatoriamente para el próximo partido!",
        null,
        0xFFCC00,
        'bold',
        HaxNotification.CHAT
    );
}

// Asegúrate de tener esta función definida
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function swapTeamColors() { 
    if (cambioCami) {
        // Mezclar las opciones antes de elegir
        shuffleOptions();

        // Ejecutar la opción elegida
        let selectedOption = lastFiveGames[lastFiveGames.length - 1]; // Obtener la última opción seleccionada
        selectedOption.partido(); // Llamar a la función del partido seleccionado
    }
}


// Función para depurar - añadir al inicio
function logCamisetasInfo() {
    console.log("Estructura de camisetasEquipos:", camisetasEquipos);
    console.log("Claves disponibles:", Object.keys(camisetasEquipos));
    
    // Comprobar camisetas rojas
    var redKits = Object.keys(camisetasEquipos).filter(key => key.includes("/red"));
    console.log("Camisetas rojas:", redKits);
    
    // Comprobar camisetas azules
    var blueKits = Object.keys(camisetasEquipos).filter(key => key.includes("/blue"));
    console.log("Camisetas azules:", blueKits);
}


function kitCommandBlue(player, message) {
    if (getRole(player) < Role.ADMIN_TEMP) {
        room.sendAnnouncement(
            "❌ No tienes permisos para cambiar las camisetas.",
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return false;
    }
    
    var msgArray = message.split(/ +/).slice(1);
    
    // Si no hay argumentos, avanza a la siguiente camiseta
    if (msgArray.length === 0) {
        setKit(Team.BLUE, currentBlueKit + 1);
        return false;
    }
    
    var camisetaId = msgArray.join(' ');
    console.log("Comando !bluekit recibido con parámetro:", camisetaId);
    
    // DEPURACIÓN: Mostrar todas las claves disponibles
    console.log("Claves en camisetasEquipos:", Object.keys(camisetasEquipos));
    
    // Si es un número, buscar por índice
    if (!isNaN(camisetaId) && camisetaId.trim() !== '') {
        var index = parseInt(camisetaId) - 1;
        console.log("Buscando por índice:", index);
        setKit(Team.BLUE, index);
        return false;
    }
    
    // Intentar búsqueda directa
    console.log("¿Existe la clave '" + camisetaId + "'?", camisetasEquipos[camisetaId] ? "Sí" : "No");
    
    // Intentar con /red al final si no lo tiene ya
    if (!camisetaId.endsWith("/blue")) {
        const claveConBlue = camisetaId + "/blue";
        console.log("¿Existe la clave '" + claveConBlue + "'?", camisetasEquipos[claveConBlue] ? "Sí" : "No");
        
        if (camisetasEquipos[claveConBlue]) {
            console.log("Encontrada clave con /blue añadido:", claveConBlue);
            asignarCamisetaPorClave(claveConBlue);
            return false;
        }
    }
    
    // Buscar por coincidencia parcial
    var camisetasAzules = Object.keys(camisetasEquipos).filter(k => k.includes("/blue"));
    console.log("Camisetas azules disponibles:", camisetasAzules);
    
    // Clave que contiene la búsqueda
    var coincidencias = camisetasAzules.filter(k => k.toLowerCase().includes(camisetaId.toLowerCase()));
    console.log("Coincidencias encontradas:", coincidencias);
    
    if (coincidencias.length > 0) {
        console.log("Usando primera coincidencia:", coincidencias[0]);
        asignarCamisetaPorClave(coincidencias[0]);
        return false;
    }
    
    // Si llegamos aquí, no se encontró
    room.sendAnnouncement(
        `❌ No se encontró ninguna camiseta con el identificador "${camisetaId}".`,
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
    );
    
    // Mostrar algunas opciones disponibles
    if (camisetasAzules.length > 0) {
        let sugerencias = camisetasAzules.slice(0, 5).map(k => k.split('/')[0]).join(', ');
        room.sendAnnouncement(
            `Algunas opciones: ${sugerencias}`,
            player.id,
            infoColor,
            'bold',
            HaxNotification.CHAT
        );
    }
    
    return false;
}
function kitCommandList(player, message) {
    var redKits = "🔴 Camisetas rojas disponibles:\n";
    for (let i = 0; i < camisetasEquipos.red.length; i++) {
        redKits += `${i+1}. ${camisetasEquipos.red[i].name}\n`;
    }
    
    var blueKits = "🔵 Camisetas azules disponibles:\n";
    for (let i = 0; i < camisetasEquipos.blue.length; i++) {
        blueKits += `${i+1}. ${camisetasEquipos.blue[i].name}\n`;
    }
    
    room.sendAnnouncement(
        redKits + "\n" + blueKits,
        player.id,
        infoColor,
        'bold',
        HaxNotification.CHAT
    );
}



// Aplicar camisetas por defecto con un pequeño retraso para asegurar que todo esté inicializado
setTimeout(function() {
    setKit(Team.RED, 0);
    setKit(Team.BLUE, 0);
}, 1000);






var opciones = [
    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xf5b606;
            redColor = [0x011ede, 0xc80056];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "BARCELONA";

            blueAngle = 73;
            blueTextColor = 0x0f2145;
            blueColor = [0xffc10a, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "REAL MADRID";
        },
        demanda: 600 // Demanda muy alta
    },
    {
        partido: function () {
            redAngle = 30;
            redTextColor = 0x231f20;
            redColor = [0xffffff, 0xee1b2c, 0xffffff];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "RIVER PLATE";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x033f86, 0xfab900, 0x033f86];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BOCA JRS.";
        },
        demanda: 600 // Alta demanda
    },
    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xffffff;
            redColor = [0xD90119, 0xC7011A, 0xAB0918];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "MANCHESTER UNITED";

            blueAngle = 90;
            blueTextColor = 0xffffff;
            blueColor = [0x95c1e6];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "MANCHESTER CITY";
        },
        demanda: 600 // Alta demanda
    },
    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0xdc052d, 0xed0038, 0xed0038];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "BAYERN  DE MUNICH";

            blueAngle = 90;
            blueTextColor = 0x1d1d1b;
            blueColor = [0x1d1d1b, 0xfad515, 0xfad515];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BORUSSIA DORTMUND";
        },
        demanda: 500 // Alta demanda
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xffffff;
            redColor = [0xdf061b, 0x000000, 0xdf061b];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AC MILAN";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x00239c, 0x000000, 0x00239c];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "INTER MILAN";
        },
        demanda: 500 // Alta demanda, partidos históricos en la Serie A
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xffffff;
            redColor = [0x1a2747, 0xde0319, 0x1a2747];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "PSG";

            blueAngle = 61;
            blueTextColor = 0xc99740;
            blueColor = [0x00a4dc, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "OLYMPIQUE MARSELLA";
        },
        demanda: 150 // Gran rivalidad en la Ligue 1 de Francia
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xffffff;
            redColor = [0xdf061b, 0x000000, 0xdf061b];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AC MILAN";

            blueAngle = 180;
            blueTextColor = 0xf7c902;
            blueColor = [0x1f1a20, 0xffffff, 0x1f1a20];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "JUVENTUS";
        },
        demanda: 150 // Un enfrentamiento de alto nivel entre equipos históricos
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0x00a032;
            redColor = [0xffcd00];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "BRASIL";

            blueAngle = 180;
            blueTextColor = 0x1e2930;
            blueColor = [0x98cef0, 0xffffff, 0x98cef0];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ARGENTINA";
        },
        demanda: 450 // Enfrentamiento entre dos de los equipos más grandes de América
    },


   {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xf3010f;
            redColor = [0xf8f8f8];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "INGLATERRA";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x000000, 0xDD0000, 0xFFCE00];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ALEMANIA";
        },
        demanda: 200 // Un clásico del fútbol europeo con dos de las selecciones más fuertes.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0x00a032;
            redColor = [0xffcd00];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "BRASIL";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x000000, 0xDD0000, 0xFFCE00];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ALEMANIA";
        },
        demanda: 150 // Ambos equipos tienen una enorme base de seguidores y tradición mundial.
    },

    {
        partido: function () {
    	redAngle = 90;  // Ángulo para el equipo rojo
    	redTextColor = 0xFFFFFF;  // Color del texto del equipo rojo
    	redColor = [0x000000, 0xDD0000, 0xFFCE00];  // Colores de Alemania (negro, rojo, amarillo)
    	room.setTeamColors(1, redAngle, redTextColor, redColor);
    	teamRed = "ALEMANIA";

    	blueAngle = 0;  // Ángulo para el equipo azul
    	blueTextColor = 0x0064aa;  // Color del texto del equipo azul
    	blueColor = [0x009e3f, 0xFFFFFF, 0xe40321];  // Colores de Italia (verde, blanco, rojo)
    	room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
    	teamBlue = "ITALIA";
        },
        demanda: 300 // Italia y Alemania son selecciones históricas, aunque quizás con un poco menos de rivalidad directa.
    },

    {
        partido: function () {
            redAngle = 70;
            redTextColor = 0xffc000;
            redColor = [0xbb0c10];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ESPAÑA";

            blueAngle = 90;
            blueTextColor = 0xeabc78;
            blueColor = [0x1b2a4a];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FRANCIA";
        },
        demanda: 200 // Un gran partido europeo con mucha rivalidad reciente en competiciones como la Eurocopa y la Copa del Mundo.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xffffff;
            redColor = [0xdd0125, 0x211f25, 0xdd0125];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "FLAMENGO";

            blueAngle = 69;
            blueTextColor = 0x801f32;
            blueColor = [0xffffff, 0xffffff, 0x621b21];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FLUMINENSE";
        },
        demanda: 150 // Clásico carioca, una de las rivalidades más grandes de Brasil.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xfad948;
            redColor = [0xbc0021];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "LIVERPOOL";

            blueAngle = 69;
            blueTextColor = 0x1b1a20;
            blueColor = [0xc70317, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "MANCHESTER UNITED";
        },
        demanda: 150 // Enfrentamiento clásico de la Premier League con grandes seguidores en todo el mundo.
    },

    {
        partido: function () {
            redAngle = 60;
            redTextColor = 0xffffff;
            redColor = [0xec1c24];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "INDEPENDIENTE";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x033f86, 0xfab900, 0x033f86];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BOCA JRS.";
        },
        demanda: 120 // Clásico argentino, una de las rivalidades más intensas en el fútbol mundial.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0x292a6d;
            redColor = [0xe3221d, 0xffffff, 0xe3221d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ATLÉTICO MADRID";

            blueAngle = 73;
            blueTextColor = 0x0f2145;
            blueColor = [0xffc10a, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "REAL MADRID";
        },
        demanda: 150 // Enfrentamiento de alto nivel en La Liga, con una gran rivalidad entre los dos grandes de Madrid.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xE3BA5B;
            redColor = [0xffffff, 0xe40615, 0xcd043a];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ARSENAL FC";

            blueAngle = 66;
            blueTextColor = 0xfbb700;
            blueColor = [0x001489];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "CHELSEA";
        },
        demanda: 150 // Clásico londinense, entre dos grandes rivales de la Premier League.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xffb200;
            redColor = [0x8f001c];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AS ROMA";

            blueAngle = 180;
            blueTextColor = 0xffffff;
            blueColor = [0x81c6ee, 0x8ccaee , 0x81c6ee];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "LAZIO";
        },
        demanda: 120 // Clásico italiano, aunque menos mediático que los de otras ligas.
    },

    {
        partido: function () {
            redAngle = 30;
            redTextColor = 0x231f20;
            redColor = [0xffffff, 0xee1b2c, 0xffffff];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "RIVER PLATE";

            blueAngle = 180;
            blueTextColor = 0x002942;
            blueColor = [0x00a5e3, 0xFFFFFF, 0x00a5e3];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "RACING";
        },
        demanda: 150 // Uno de los clásicos más importantes de Argentina, muy seguido en todo el país.
    },

    {
        partido: function () {
            redAngle = 60;
            redTextColor = 0xffffff;
            redColor = [0xec1c24];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "INDEPENDIENTE";

            blueAngle = 180;
            blueTextColor = 0x002942;
            blueColor = [0x00a5e3, 0xFFFFFF, 0x00a5e3];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "RACING";
        },
        demanda: 600 // Rivalidad argentina entre dos equipos de Avellaneda, con mucha historia.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xe9282d, 0x1d3b56, 0xe9282d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SAN LORENZO";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x033f86, 0xfab900, 0x033f86];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BOCA JRS.";
        },
        demanda: 450 // Clásico del fútbol argentino con una gran rivalidad, especialmente en Buenos Aires.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xffffff;
            redColor = [0xee1d23, 0x000000];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "NEWELLS";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0xfcd828, 0x144178, 0xfcd828];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ROSARIO CENTRAL";
        },
        demanda: 550 // Un clásico rosarino con una gran historia, muy importante en la ciudad de Rosario.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0x6a2331, 0x74192e, 0x74192e];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "LANÚS";

            blueAngle = 180;
            blueTextColor = 0xb59859;
            blueColor = [0x007836, 0xffffff, 0x007836];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BANFIELD";
        },
        demanda: 50 // Clásico del fútbol argentino, aunque menos mediático que otros clásicos más populares.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xa7a9ab;
            redColor = [0x1e315a, 0xFFFFFF, 0x1e315a];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "TALLERES (C)";

            blueAngle = 70;
            blueTextColor = 0xffffff;
            blueColor = [0x1a120c, 0x009cd0, 0x009cd0];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "BELGRANO";
        },
        demanda: 50 // Clásico cordobés, con mucha rivalidad y apoyo de los hinchas en Córdoba.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0x000000;
            redColor = [0xF4F4F6];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "CORINTHIANS";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x006337, 0x00713d, 0x00713d];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "PALMEIRAS";
        },
        demanda: 120 // Un clásico del fútbol brasileño con gran seguimiento, especialmente en São Paulo.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xffffff;
            redColor = [0x9e0424, 0x1c6137, 0x9e0424];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "FLUMINENSE";

            blueAngle = 29;
            blueTextColor = 0xd42a2a;
            blueColor = [0x19181B, 0xE6E6E4, 0x19181B];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "VASCO DA GAMA";
        },
        demanda: 50 // Un clásico carioca entre dos de los clubes más tradicionales de Río de Janeiro.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0x006337, 0x00713d, 0x00713d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "PALMEIRAS";

            blueAngle = 90;
            blueTextColor = 0x3b4043;
            blueColor = [0xf1f5f6];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "SANTOS FC";
        },
        demanda: 120 // Un clásico paulista entre dos gigantes del fútbol brasileño, con una gran rivalidad en São Paulo.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0xff020c];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SC INTERNACIONAL";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x009ee2, 0x05171d, 0x009ee2];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "GREMIO";
        },
        demanda: 120 // Un clásico gaucho muy esperado por los hinchas de Porto Alegre, con una rivalidad histórica.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xced3d9;
            redColor = [0x0b245f, 0x214196, 0x7e6fb8];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ARGENTINA";

            blueAngle = 90;
            blueTextColor = 0x000000;
            blueColor = [0x75cbfa];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "URUGUAY";
        },
        demanda: 100 // El clásico rioplatense entre dos de las selecciones más grandes de Sudamérica.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xE0B85A;
            redColor = [0xffffff, 0xe40615, 0xe40615];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ARSENAL FC";

            blueAngle = 72;
            blueTextColor = 0x111836;
            blueColor = [0x0b0e1e, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "TOTTENHAM";
        },
        demanda: 70 // Un clásico del fútbol inglés con mucha rivalidad, especialmente en el norte de Londres.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xFFFFFF;
            redColor = [0xfbba00, 0xab092e];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "GALATASARAY";

            blueAngle = 180;
            blueTextColor = 0x020E1F;
            blueColor = [0xfff100, 0x014582, 0xfff100];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FENERBAHCE";
        },
        demanda: 50 // Un clásico turco entre dos de los equipos más grandes de Estambul, muy popular y lleno de historia.
    },

    {
        partido: function () {
            redAngle = 60;
            redTextColor = 0xFFFFFF;
            redColor = [0xdc0316, 0xdc0316, 0x08265c];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "MEDELLIN";

            blueAngle = 180;
            blueTextColor = 0x000000;
            blueColor = [0x018c4b, 0xffffff, 0x018c4b];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ATL. NACIONAL (COL)";
        },
        demanda: 55 // Un clásico colombiano entre dos de los clubes más emblemáticos del país, muy disputado.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0x000000;
            redColor = [0x039940, 0xffffff, 0x039940];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "CELTIC";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x01319f];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "RANGERS";
        },
        demanda: 55 // El Old Firm de Escocia, una de las rivalidades más intensas y antiguas del fútbol europeo.
    },

    {
        partido: function () {
            redAngle = 33;
            redTextColor = 0x000000;
            redColor = [0xF6F6F7];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "COLO COLO";

            blueAngle = 33;
            blueTextColor = 0xf4f4f4;
            blueColor = [0x1C2445];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "U DE CHILE";
        },
        demanda: 35 // Un clásico del fútbol chileno, conocido por la rivalidad entre los dos equipos más grandes del país.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xffffff;
            redColor = [0x00824A, 0x006327, 0x006327];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "FERRO";

            blueAngle = 180;
            blueTextColor = 0x0063a8;
            blueColor = [0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "VELEZ";
        },
        demanda: 36 // Un enfrentamiento argentino de gran historia, con dos clubes que representan diferentes estilos de fútbol.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xe9282d, 0x1d3b56, 0xe9282d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SAN LORENZO";

            blueAngle = 180;
            blueTextColor = 0x0063a8;
            blueColor = [0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "VELEZ";
        },
        demanda: 35 // Un clásico argentino entre dos equipos de gran tradición, ambos de la ciudad de Buenos Aires.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xe9282d, 0x1d3b56, 0xe9282d];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SAN LORENZO";

            blueAngle = 52;
            blueTextColor = 0xff0000;
            blueColor = [0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "HURACÁN";
        },
        demanda: 156 // El clásico entre estos dos equipos del barrio de Boedo y Parque Patricios, siempre lleno de pasión.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0x323232;
            redColor = [0xe41815, 0xFFFFFF, 0xe41815];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ESTUDIANTES (LP)";

            blueAngle = 90;
            blueTextColor = 0x00afef;
            blueColor = [0xFFFFFF, 0x12175e, 0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "GIMNASIA (LP)";
        },
        demanda: 544 // El clásico platense, un enfrentamiento muy esperado en la ciudad de La Plata entre dos de sus clubes más representativos.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0x812124;
            redColor = [0xE1DCC5];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "UNIVERSITARIO";

            blueAngle = 180;
            blueTextColor = 0xd9030f;
            blueColor = [0x062247, 0xFFFFFF, 0x062247];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ALIANZA LIMA";
        },
        demanda: 35 // Un enfrentamiento clásico del fútbol peruano, muy esperado en el país, entre dos de los clubes más grandes de Lima.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xFFFFFF;
            redColor = [0xF7F8FA, 0xd71716, 0xd71716];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "INDEPENDIENTE SANTA FE";

            blueAngle = 55;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x232937, 0x1252b3, 0x1252b3];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "MILLONARIOS";
        },
        demanda: 330 // Un clásico del fútbol colombiano entre dos equipos de gran rivalidad de Bogotá, conocidos por su historia.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xffca00, 0x000000, 0xffca00];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "PEÑAROL";

            blueAngle = 55;
            blueTextColor = 0xd0142c;
            blueColor = [0x003895, 0xFFFFFF, 0x003895];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "NACIONAL (UY)";
        },
        demanda: 610 // El clásico del fútbol uruguayo entre los dos clubes más grandes de Montevideo, con una rivalidad de larga data.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xe10602, 0x00158c, 0xe10602];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "CERRO PORTEÑO";

            blueAngle = 90;
            blueTextColor = 0xa28026;
            blueColor = [0xFFFFFF, 0x0d0d0d, 0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "OLIMPIA";
        },
        demanda: 125 // Un clásico del fútbol paraguayo entre los dos equipos más grandes de Asunción, cargado de historia y emoción.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xf7c902;
            redColor = [0x1f1a20, 0xffffff, 0x1f1a20];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "JUVENTUS";

            blueAngle = 180;
            blueTextColor = 0xffffff;
            blueColor = [0x01b9eb];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "NAPOLI";
        },
        demanda: 70 // El clásico italiano, un enfrentamiento entre los dos clubes más importantes del sur de Italia, con mucha historia y rivalidad.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xceac02;
            redColor = [0xffffff, 0xda0120, 0xffffff];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AJAX";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x0b826e, 0x02917f, 0x0b826e];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FEYENOORD";
        },
        demanda: 100 // El clásico de los Países Bajos, con la rivalidad de estos dos grandes clubes de Ámsterdam y Rotterdam.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xFFFFFF;
            redColor = [0xe30613];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SL BENFICA";

            blueAngle = 180;
            blueTextColor = 0xd0000c;
            blueColor = [0x0747ab, 0xffffff, 0x0747ab];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FC PORTO";
        },
        demanda: 70 // El clásico del fútbol portugués, un duelo tradicional entre los dos equipos más importantes de Lisboa y Oporto.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xFFFFFF;
            redColor = [0xff6300, 0x060902, 0xff6300];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SHAKHTAR DONETSK";

            blueAngle = 65;
            blueTextColor = 0x027fd9;
            blueColor = [0x0289da, 0xffffff, 0xffffff];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "DYNAMO KYIV";
        },
        demanda: 70 // Un enfrentamiento de dos grandes equipos ucranianos con una gran rivalidad entre Shakhtar Donetsk y Dynamo Kyiv.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xFFFFFF;
            redColor = [0xe30613];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "SL BENFICA";

            blueAngle = 90;
            blueTextColor = 0x000000;
            blueColor = [0x008359, 0xffffff, 0x008359];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "SPORTING CP";
        },
        demanda: 100 // El derbi lisboeta entre SL Benfica y Sporting CP, con una rivalidad centenaria en la ciudad de Lisboa.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0xffb200;
            redColor = [0x8f001c];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "AS ROMA";

            blueAngle = 180;
            blueTextColor = 0xffffff;
            blueColor = [0x01b9eb];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "NAPOLI";
        },
        demanda: 80 // El clásico italiano, una rivalidad entre dos de los clubes más grandes del país: Roma y Nápoles.
    },

    {
        partido: function () {
            redAngle = 180;
            redTextColor = 0xf7c902;
            redColor = [0x1f1a20, 0xffffff, 0x1f1a20];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "JUVENTUS";

            blueAngle = 180;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x00239c, 0x000000, 0x00239c];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "INTER MILAN";
        },
        demanda: 120 // Un enfrentamiento clásico de Italia, entre la Juventus y el Inter de Milán, dos de los equipos más exitosos de la Serie A.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0x0A1129;
            redColor = [0xffba00, 0x0033cc, 0xffba00];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "TIGRES UANL";

            blueAngle = 180;
            blueTextColor = 0xe50913;
            blueColor = [0x0e2141, 0xffffff, 0x0e2141];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "MONTERREY";
        },
        demanda: 65 // Un clásico regio de la liga mexicana, lleno de rivalidad y pasión.
    },

    {
        partido: function () {
            redAngle = 90;
            redTextColor = 0xffffff;
            redColor = [0xdd0125, 0x211f25, 0xdd0125];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "FLAMENGO";

            blueAngle = 90;
            blueTextColor = 0xFFFFFF;
            blueColor = [0x006337, 0x00713d, 0x00713d];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "PALMEIRAS";
        },
        demanda: 220 // Un clásico brasileño muy esperado entre estos dos equipos, con mucha historia y rivalidad.
    },

    {
        partido: function () {
            redAngle = 123;
            redTextColor = 0x005da4;
            redColor = [0xeb2a2f, 0xFFFFFF, 0xeb2a2f];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ARGENTINOS JRS.";

            blueAngle = 90;
            blueTextColor = 0xfd6f21;
            blueColor = [0xFFFFFF, 0x5a3e22, 0xFFFFFF];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "PLATENSE";
        },
        demanda: 65 // Un partido entre equipos del fútbol argentino con rivalidad y mucha historia local.
    },

    {
        partido: function () {
            redAngle = 130;
            redTextColor = 0xf9cd39;
            redColor = [0xa92121, 0xa92121, 0x01553e];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "PORTUGAL";

            blueAngle = 180;
            blueTextColor = 0x1e2930;
            blueColor = [0x98cef0, 0xffffff, 0x98cef0];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ARGENTINA";
        },
        demanda: 200 // Un partido internacional entre selecciones de gran nivel con historia de enfrentamientos.
    },

    {
        partido: function () {
            redAngle = 66;
            redTextColor = 0xffffff;
            redColor = [0xf36b22];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "HOLANDA";

            blueAngle = 180;
            blueTextColor = 0x1e2930;
            blueColor = [0x98cef0, 0xffffff, 0x98cef0];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "ARGENTINA";
        },
        demanda: 40 // Otro clásico internacional, con equipos de renombre mundial enfrentándose.
    },

    {
        partido: function () {
            redAngle = 0;
            redTextColor = 0x0064aa;
            redColor = [0x009e3f, 0xFFFFFF, 0xe40321];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ITALIA";

            blueAngle = 90;
            blueTextColor = 0x000000;
            blueColor = [0x75cbfa];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "URUGUAY";
        },
        demanda: 140 // Un clásico de selecciones de nivel mundial, con mucha historia en la Copa del Mundo.
    },

   {
        partido: function () {
            redAngle = 0;
            redTextColor = 0x0064aa;
            redColor = [0x009e3f, 0xFFFFFF, 0xe40321];
            room.setTeamColors(1, redAngle, redTextColor, redColor);
            teamRed = "ITALIA";

            blueAngle = 90;
            blueTextColor = 0xeabc78;
            blueColor = [0x1b2a4a];
            room.setTeamColors(2, blueAngle, blueTextColor, blueColor);
            teamBlue = "FRANCIA";
        },
        demanda: 200 // Un enfrentamiento clásico entre dos selecciones de renombre mundial, con mucha historia en competiciones internacionales.
    },


    // Agregar más opciones según sea necesario
];

/* OBJECTS */

class Goal {
    constructor(time, team, striker, assist) {
        this.time = time;
        this.team = team;
        this.striker = striker;
        this.assist = assist;
    }
}

class Game {
    constructor() {
        this.date = Date.now();
        this.scores = room.getScores();
        this.playerComp = getStartingLineups();
        this.goals = [];
        this.rec = room.startRecording();
        this.touchArray = [];
    }
}

class PlayerComposition {
    constructor(player, auth, timeEntry, timeExit) {
        this.player = player;
        this.auth = auth;
        this.timeEntry = timeEntry;
        this.timeExit = timeExit;
        this.inactivityTicks = 0;
        this.GKTicks = 0;
    }
}

class MutePlayer {
    constructor(name, id, auth) {
        this.id = MutePlayer.incrementId();
        this.name = name;
        this.playerId = id;
        this.auth = auth;
        this.unmuteTimeout = null;
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1
        else this.latestId++
        return this.latestId
    }

    setDuration(minutes) {
        this.unmuteTimeout = setTimeout(() => {
            room.sendAnnouncement(
                `You have been unmuted.`,
                this.playerId,
                announcementColor,
                "bold",
                HaxNotification.CHAT
            );
            this.remove();
        }, minutes * 60 * 1000);
        muteArray.add(this);
    }

    remove() {
        this.unmuteTimeout = null;
        muteArray.removeById(this.id);
    }
}

class MuteList {
    constructor() {
        this.list = [];
    }

    add(mutePlayer) {
        this.list.push(mutePlayer);
        return mutePlayer;
    }

    getById(id) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.id === id);
        if (index !== -1) {
            return this.list[index];
        }
        return null;
    }

    getByPlayerId(id) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.playerId === id);
        if (index !== -1) {
            return this.list[index];
        }
        return null;
    }

    getByAuth(auth) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.auth === auth);
        if (index !== -1) {
            return this.list[index];
        }
        return null;
    }

    removeById(id) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.id === id);
        if (index !== -1) {
            this.list.splice(index, 1);
        }
    }

    removeByAuth(auth) {
        var index = this.list.findIndex(mutePlayer => mutePlayer.auth === auth);
        if (index !== -1) {
            this.list.splice(index, 1);
        }
    }
}

class BallTouch {
    constructor(player, time, goal, position) {
        this.player = player;
        this.time = time;
        this.goal = goal;
        this.position = position;
    }
}

class HaxStatistics {
    constructor(playerName = '') {
        this.playerName = playerName;
        this.games = 0;
        this.wins = 0;
        this.winrate = '0.00%';
        this.playtime = 0;
        this.goals = 0;
        this.assists = 0;
        this.CS = 0;
        this.ownGoals = 0;
    }
}

/* PLAYERS */

const Team = { SPECTATORS: 0, RED: 1, BLUE: 2 };
const State = { PLAY: 0, PAUSE: 1, STOP: 2 };
// Modificar la estructura existente para añadir tus nuevos roles
const Role = { 
    PLAYER: 0, 
    ADMIN_TEMP: 1, 
    ADMIN_PERM: 2, 
    SUPERADMIN: 3, 
    CO_OWNER: 4, 
    OWNER: 5,
    MASTER: 6  // Mantenemos MASTER como el rol más alto
};
const HaxNotification = { NONE: 0, CHAT: 1, MENTION: 2 };
const Situation = { STOP: 0, KICKOFF: 1, PLAY: 2, GOAL: 3 };

var gameState = State.STOP;
var playSituation = Situation.STOP;
var goldenGoal = false;

var playersAll = [];
var players = [];
var teamRed = [];
var teamBlue = [];
var teamSpec = [];
// Agregar estas variables globales al inicio del archivo
var teamRedName = "EQUIPO LOCAL";
var teamBlueName = "EQUIPO VISITANTE";
var teamRedStats = [];
var teamBlueStats = [];

var banList = [];

/* STATS */

var possession = [0, 0];
var actionZoneHalf = [0, 0];
var lastWinner = Team.SPECTATORS;
var streak = 0;



// Configuración de GitHub
const GITHUB_CONFIG = {
    owner: 'lekysitoo',
    repo: 'hostlokotest',
    path: 'recovery_codes.json',
    token: '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',  // Recomiendo generar un nuevo token
    branch: 'main',
    apiBaseUrl: 'https://api.github.com'
};



/* AUTH */

// Lista de IDs de jugadores con modo espía activado
var spyModeEnabled = new Set();
// Objeto para almacenar códigos de recuperación
var recoveryCodeMap = {};
var authToCodeMap = {};   // Mapa inverso: {auth -> código}

var authArray = [];
var adminList = [
    // ['INSERT_AUTH_HERE_1', 'NICK_OF_ADMIN_1'],
    // ['INSERT_AUTH_HERE_2', 'NICK_OF_ADMIN_2'],
];
var masterList = [
  'LbyIJ1ApyhPUvYBTpMIY0o76Is2tYDw19pOzOnlb36s',
    // 'INSERT_MASTER_AUTH_HERE_2'
 
];

   // Nuevas listas para Owner y Co-Owner
var ownerList = [
    'tj7tCCoe8M046HUuiwcEqyPOkRFc_jp5Yn9_6ez9cNk'
];
var coownerList = [
   'xpyx5yWF34U-l1lberNwvLQqn7h1toqnYhVdv-2GTzE'
];

/* COMMANDS */

var commands = {



    level: {
        aliases: ['nivel', 'lvl', 'xp'],
        roles: Role.PLAYER,
        desc: `
        Muestra tu nivel actual y cuánta experiencia necesitas para subir al siguiente nivel.
        Uso: !level`,
        function: levelCommand
    },
    adminhelp: {
        aliases: ['ah', 'admincmds'],
        roles: Role.ADMIN_TEMP,
        desc: `
        Muestra todos los comandos administrativos disponibles según tu rol.
        Uso: !adminhelp [comando opcional]`,
        function: adminHelpCommand
    },

    recoverycode: {
        aliases: ['getcode', 'mycode', 'codigo', 'micodigo'],
        roles: Role.PLAYER,
        desc: `
        Obtiene un código de recuperación para transferir tus estadísticas a otro navegador.
        Uso: !recoverycode`,
        function: getRecoveryCodeCommand
    },
    
    recover: {
        aliases: ['usecode', 'reclaim', 'recuperar'],
        roles: Role.PLAYER,
        desc: `
        Usa un código de recuperación para transferir estadísticas desde otro navegador.
        Uso: !recover [código]`,
        function: useRecoveryCodeCommand
    },

    ban: {
        aliases: ['banear', 'banea', 'baneo', 'baneo', 'ban'],
        roles: Role.ADMIN_PERM,
        desc: `
        Este comando permite banear permanentemente a un jugador.
        Uso: !ban #[id] [razón opcional]
        Ejemplo: !ban #3 Comportamiento tóxico`,
        function: banCommand
    },
    
    banlist: {
        aliases: ['bans', 'listabans', 'baneados'],
        roles: Role.ADMIN_TEMP,
        desc: `
        Este comando muestra la lista de jugadores baneados.
        Uso: !banlist`,
        function: banListCommand
    },
    
    unban: {
        aliases: ['desbanear', 'desbanea', 'desbaneo', 'desbaneo', 'desban'],
        roles: Role.ADMIN_PERM,
        desc: `
        Este comando permite desbanear a un jugador.
        Uso: !unban [número/id/auth]
        Ejemplo: !unban 1 (desbanea el primer jugador de la lista)
        Ejemplo: !unban 5 (desbanea el jugador con ID 5)`,
        function: unbanCommand
    },

    spy: {
        aliases: ['espiar'],
        roles: Role.ADMIN_PERM,
        desc: `
        Este comando activa/desactiva el modo espía para ver mensajes privados y de equipo.
        Uso: !spy
        Solo disponible para admins permanentes y superiores.`,
        function: spyCommand
    },
    
    vip: {
        aliases: ['vipchat', 'v'],
        roles: Role.OWNER,
        desc: `
        Este comando envía un mensaje que solo pueden ver los propietarios y roles superiores.
        Uso: !vip [mensaje] o vip [mensaje]
        Solo disponible para OWNER y superiores.`,
        function: vipChatCommand
    },

    tempban: {
        aliases: ['tban', 'bantemp', 'tbanear', 'tbanear', 'tban'],
        roles: Role.ADMIN_TEMP,
        desc: `
        Este comando permite banear temporalmente a un jugador.
        Uso: !tempban #[id] [minutos] [razón opcional]
        Ejemplo: !tempban #3 30 Spam`,
        function: tempBanCommand
    },
    
    kick: {
        aliases: ['kickear', 'kick', 'kickear', 'kick', 'kick', 'k'],
        roles: Role.ADMIN_TEMP,
        desc: `
        Este comando permite kickear a un jugador sin banearlo.
        Uso: !kick #[id] [razón opcional]
        Ejemplo: !kick #3 Comportamiento inapropiado`,
        function: kickCommand
    },
    
    ac: {
        aliases: ['adminchat', 'a'],
        roles: Role.ADMIN_TEMP,
        desc: `
        Este comando envía un mensaje que solo pueden ver los administradores.
        Uso: !ac [mensaje] o ac [mensaje]
        Ejemplo: !ac Hola a todos los admins`,
        function: adminChatCommand
    },

    addowner: {
        aliases: ['setowner'],
        roles: Role.MASTER,
        desc: `
        Este comando permite añadir a un jugador a la lista de owners.
        Uso: !addowner #[id]`,
        function: addOwnerCommand
    },
    
    addcoowner: {
        aliases: ['setcoowner'],
        roles: Role.OWNER,
        desc: `
        Este comando permite añadir a un jugador a la lista de co-owners.
        Uso: !addcoowner #[id]`,
        function: addCoOwnerCommand
    },
    
    removeowner: {
        aliases: ['unowner'],
        roles: Role.MASTER,
        desc: `
        Este comando permite remover a un jugador de la lista de owners.
        Uso: !removeowner #[id]`,
        function: removeOwnerCommand
    },
    
    removecoowner: {
        aliases: ['uncoowner'],
        roles: Role.OWNER,
        desc: `
        Este comando permite remover a un jugador de la lista de co-owners.
        Uso: !removecoowner #[id]`,
        function: removeCoOwnerCommand
    },

    showpasswords: {
        aliases: ['showpass', 'passwords'],
        roles: Role.OWNER,
        desc: `
        Este comando muestra las contraseñas actuales para todos los roles.
        Solo visible para OWNER o superior.`,
        function: showRolePasswordsCommand
    },
    
    setpassword: {
        aliases: ['setpass', 'changepass'],
        roles: Role.OWNER,
        desc: `
        Este comando permite cambiar la contraseña de un rol específico.
        Uso: !setpassword [rol] [nueva_contraseña]
        Roles disponibles: master, owner, coowner, superadmin, admin`,
        function: changeRolePasswordCommand
    },
    
    login: {
        aliases: ['auth'],
        roles: Role.PLAYER,
        desc: `
        Este comando permite autenticarte con un rol superior usando una contraseña.
        Uso: !login [contraseña]`,
        function: loginCommand
    },


    changepass: {
        aliases: ['setpass'],
        roles: Role.OWNER,
        desc: `
        Este comando permite cambiar las contraseñas de acceso a roles superiores.
        Uso: !changepass [superadmin/coowner/owner] [nuevaContraseña]
        Solo disponible para OWNER o superior.`,
        function: changePasswordCommand
    },

    passwords: {
        aliases: ['passwords'],
        roles: Role.OWNER,
        desc: 'Muestra las contraseñas actuales.',
        function: showPasswordsCommand
    },

    role: {
        aliases: ['setrole'],
        roles: Role.OWNER,  // Solo OWNER o superior puede usar este comando
        desc: `
        Este comando permite asignar un rol a un jugador.
        Uso: !role [nombreJugador] [master/owner/coowner/superadmin/admin/player]
        Ejemplo: !role Botardo owner - Asigna el rol de OWNER a Botardo`,
        function: roleCommand
    },

    vercamisetas: {
        aliases: ['listcamisetas', 'debugcamisetas'],
        roles: Role.ADMIN_TEMP,
        desc: 'Muestra información de depuración sobre las camisetas disponibles.',
        function: function(player, message) {
            // Verificar si camisetasEquipos existe
            if (!camisetasEquipos) {
                room.sendAnnouncement(
                    "Error: camisetasEquipos no está definido",
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
                return false;
            }
            
            // Contar cuántas camisetas hay
            var total = Object.keys(camisetasEquipos).length;
            var rojas = Object.keys(camisetasEquipos).filter(k => k.includes("/red")).length;
            var azules = Object.keys(camisetasEquipos).filter(k => k.includes("/blue")).length;
            
            room.sendAnnouncement(
                `Info de camisetas: Total: ${total}, Rojas: ${rojas}, Azules: ${azules}`,
                player.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            
            // Mostrar primeras 3 claves como ejemplo
            var ejemplos = Object.keys(camisetasEquipos).slice(0, 3);
            room.sendAnnouncement(
                `Ejemplos de claves: ${ejemplos.join(", ")}`,
                player.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            
            // Mostrar un ejemplo de objeto
            if (ejemplos.length > 0) {
                var ejemplo = camisetasEquipos[ejemplos[0]];
                room.sendAnnouncement(
                    `Ejemplo de camiseta (${ejemplos[0]}): ${JSON.stringify(ejemplo)}`,
                    player.id,
                    infoColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
            
            return false;
        }
    },
    
    debug: {
        aliases: ['test', 'diagnostico'],
        roles: Role.ADMIN_TEMP,
        desc: 'Realiza diagnóstico del sistema de camisetas.',
        function: function(player, message) {
            // Verificar si camisetasEquipos existe
            if (!camisetasEquipos) {
                room.sendAnnouncement(
                    "Error: camisetasEquipos no está definido",
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
                return false;
            }
            
            // Contar cuántas camisetas hay
            var total = Object.keys(camisetasEquipos).length;
            var rojas = Object.keys(camisetasEquipos).filter(k => k.includes("/red")).length;
            var azules = Object.keys(camisetasEquipos).filter(k => k.includes("/blue")).length;
            
            room.sendAnnouncement(
                `Info de camisetas: Total: ${total}, Rojas: ${rojas}, Azules: ${azules}`,
                player.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            
            // Mostrar primeras 3 claves como ejemplo
            var ejemplos = Object.keys(camisetasEquipos).slice(0, 3);
            room.sendAnnouncement(
                `Ejemplos de claves: ${ejemplos.join(", ")}`,
                player.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            
            // Mostrar un ejemplo de objeto
            if (ejemplos.length > 0) {
                var ejemplo = camisetasEquipos[ejemplos[0]];
                room.sendAnnouncement(
                    `Ejemplo de camiseta (${ejemplos[0]}): ${JSON.stringify(ejemplo)}`,
                    player.id,
                    infoColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
            
            return false;
        }
    },


    partido: {
        aliases: ["match", "equipos", "p"],
        desc: "Cambia las camisetas a un partido específico o aleatorio",
        roles: Role.ADMIN_TEMP,
        exec: function(player, message) {
            var args = message.split(" ").slice(1);
            
            if (args.length === 0) {
                // Sin argumentos, aplicar partido aleatorio
                var partidoAleatorio = seleccionarPartidoAleatorio();
                partidoAleatorio.partido();
                room.sendAnnouncement(
                    "✅ Se han aplicado camisetas aleatorias: " + teamRed + " vs " + teamBlue,
                    null,
                    successColor,
                    'bold',
                    HaxNotification.CHAT
                );
                return false;
            }
            
            // Con argumento numérico, aplicar partido específico
            var indice = parseInt(args[0]) - 1; // Restamos 1 para que sea base-0
            if (!isNaN(indice) && indice >= 0 && indice < opciones.length) {
                try {
                    opciones[indice].partido();
                    room.sendAnnouncement(
                        "✅ Se ha aplicado el partido: " + teamRed + " vs " + teamBlue,
                        null,
                        successColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } catch (error) {
                    room.sendAnnouncement(
                        "❌ No se pudo aplicar el partido con índice " + (indice + 1),
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
                return false;
            }
            
            // Si el argumento es "lista", mostrar todos los partidos
            if (args[0] === "lista" || args[0] === "list") {
                // Enviar los primeros 15 partidos
                var mensaje = "Partidos disponibles (1-15):\n";
                for (var i = 0; i < Math.min(15, opciones.length); i++) {
                    var nombreRojo = "";
                    var nombreAzul = "";
                    
                    try {
                        nombreRojo = opciones[i].partido.toString().match(/teamRed = "([^"]+)"/)?.[1] || "Equipo " + (i + 1);
                        nombreAzul = opciones[i].partido.toString().match(/teamBlue = "([^"]+)"/)?.[1] || "";
                    } catch (e) {
                        nombreRojo = "Equipo " + (i + 1);
                        nombreAzul = "Equipo " + (i + 1) + "B";
                    }
                    
                    mensaje += (i + 1) + ". " + nombreRojo + " vs " + nombreAzul + "\n";
                }
                
                room.sendAnnouncement(
                    mensaje,
                    player.id,
                    infoColor,
                    'bold',
                    HaxNotification.CHAT
                );
                
                // Si hay más de 15 partidos, mostrar un mensaje para verlos
                if (opciones.length > 15) {
                    room.sendAnnouncement(
                        "Usa !partido lista2 para ver más partidos",
                        player.id,
                        infoColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
                
                return false;
            }
            
            // Mostrar mensaje de ayuda
            room.sendAnnouncement(
                "Uso: !partido [número] - Cambia a un partido específico\n!partido - Aplica un partido aleatorio\n!partido lista - Muestra partidos disponibles",
                player.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            
            return false;
        }
    },
// COMANDOS DE CAMISETAS
redkit: {
    aliases: ['rk'],
    roles: Role.ADMIN_TEMP,
    desc: `
    Este comando cambia la camiseta del equipo rojo. Puedes especificar un número o nombre de equipo.`,
    function: function(player, message) {
        if (getRole(player) < Role.ADMIN_TEMP) {
            room.sendAnnouncement(
                "❌ No tienes permisos para cambiar las camisetas.",
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            return false;
        }
        
        var msgArray = message.split(/ +/).slice(1);
        if (msgArray.length === 0) {
            // Si no se especifica una camiseta, mostrar la lista
            listarCamisetasDisponibles(player, 'red');
            return false;
        }
        
        var camisetaId = msgArray.join(' ');
        
        // Si es un número, buscar la camiseta por índice
        if (!isNaN(camisetaId) && camisetaId.trim() !== '') {
            var camisetas = Object.keys(camisetasEquipos).filter(key => key.includes('/red'));
            var index = parseInt(camisetaId) - 1;
            
            if (index >= 0 && index < camisetas.length) {
                asignarCamisetaPorClave(camisetas[index]);
            } else {
                room.sendAnnouncement(
                    `❌ Número de camiseta inválido. Usa un número entre 1 y ${camisetas.length}.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            // Buscar por nombre
            var camisetaEncontrada = false;
            for (var key in camisetasEquipos) {
                if (key.includes('/red') && 
                    camisetasEquipos[key].nombreEquipo.toLowerCase().includes(camisetaId.toLowerCase())) {
                    asignarCamisetaPorClave(key);
                    camisetaEncontrada = true;
                    break;
                }
            }
            
            if (!camisetaEncontrada) {
                room.sendAnnouncement(
                    `❌ No se encontró ninguna camiseta para el equipo rojo con el nombre "${camisetaId}".`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        }
    }
},
bluekit: {
    aliases: ['bk'],
    roles: Role.ADMIN_TEMP,
    desc: `
    Este comando cambia la camiseta del equipo azul. Puedes especificar un número o nombre de equipo.`,
    function: function(player, message) {
        if (getRole(player) < Role.ADMIN_TEMP) {
            room.sendAnnouncement(
                "❌ No tienes permisos para cambiar las camisetas.",
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            return false;
        }
        
        var msgArray = message.split(/ +/).slice(1);
        if (msgArray.length === 0) {
            // Si no se especifica una camiseta, mostrar la lista
            listarCamisetasDisponibles(player, 'blue');
            return false;
        }
        
        var camisetaId = msgArray.join(' ');
        
        // Si es un número, buscar la camiseta por índice
        if (!isNaN(camisetaId) && camisetaId.trim() !== '') {
            var camisetas = Object.keys(camisetasEquipos).filter(key => key.includes('/blue'));
            var index = parseInt(camisetaId) - 1;
            
            if (index >= 0 && index < camisetas.length) {
                asignarCamisetaPorClave(camisetas[index]);
            } else {
                room.sendAnnouncement(
                    `❌ Número de camiseta inválido. Usa un número entre 1 y ${camisetas.length}.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            // Buscar por nombre
            var camisetaEncontrada = false;
            for (var key in camisetasEquipos) {
                if (key.includes('/blue') && 
                    camisetasEquipos[key].nombreEquipo.toLowerCase().includes(camisetaId.toLowerCase())) {
                    asignarCamisetaPorClave(key);
                    camisetaEncontrada = true;
                    break;
                }
            }
            
            if (!camisetaEncontrada) {
                room.sendAnnouncement(
                    `❌ No se encontró ninguna camiseta para el equipo azul con el nombre "${camisetaId}".`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        }
    }
},
kits: {
    aliases: ['camisetas'],
    roles: Role.PLAYER,
    desc: `
    Este comando muestra todas las camisetas disponibles. Puedes especificar 'red' o 'blue' para ver solo las de un equipo.`,
    function: CamisetasFun
},

// Comandos para diferentes categorías de equipos
conmebol: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de CONMEBOL disponibles`,
    function: CONMEBOLFun
},
uefa: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de UEFA disponibles`,
    function: UEFAFun
},
concacaf: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de CONCACAF disponibles`,
    function: CONCACAFFun
},
primera: {
    aliases: ['superliga'],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de Primera División disponibles`,
    function: SuperligaFun
},
ascenso: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de Ascenso disponibles`,
    function: AscensoFun
},
paises: {
    aliases: ['selecciones'],
    roles: Role.PLAYER,
    desc: `Muestra las selecciones nacionales disponibles`,
    function: PaisesFun
},
laliga: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de La Liga disponibles`,
    function: LaLigaFun
},
seriea: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Serie A disponibles`,
    function: SerieATIMFun
},
serieb: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Serie B disponibles`,
    function: SerieBItaliaFun
},
brasileirao: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos del Brasileirão disponibles`,
    function: BrasilLeagueFun
},
premierleague: {
    aliases: ['premier'],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Premier League disponibles`,
    function: PremierLeagueFun
},
bundesliga: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Bundesliga disponibles`,
    function: BundesligaFun
},
ligue1: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Ligue 1 disponibles`,
    function: Ligue1Fun
},
eredivisie: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Eredivisie disponibles`,
    function: EredivisieFun
},
primeiraliga: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Primeira Liga disponibles`,
    function: PrimeiraLigaFun
},
superlig: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Superlig disponibles`,
    function: SuperLigFun
},
campeonatoruso: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos del campeonato ruso disponibles`,
    function: CampeonatoRusoFun
},
premierucrania: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Premier de Ucrania disponibles`,
    function: PremierUcranianaFun
},
superligasuiza: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Super Liga Suiza disponibles`,
    function: RaiffeisenSuperLeagueFun
},
campeonatouruguayo: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos del campeonato uruguayo disponibles`,
    function: LigaUruguayaFun
},
ligaparaguaya: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Liga Paraguaya disponibles`,
    function: LigaParaguayaFun
},
ligaaguila: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Liga Águila disponibles`,
    function: LigaAguilaFun
},
ligapro: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Liga Pro disponibles`,
    function: LigaProFun
},
liga1peru: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Liga 1 de Perú disponibles`,
    function: Liga1PeruFun
},
campeonatochileno: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos del campeonato chileno disponibles`,
    function: CampeonatoChilenoFun
},
ligaboliviana: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Liga Boliviana disponibles`,
    function: LigaBolivianaFun
},
ligavenezolana: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Liga Venezolana disponibles`,
    function: LigaVenezolanaFun
},
ligamx: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la Liga MX disponibles`,
    function: LigaMXFun
},
mls: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de la MLS disponibles`,
    function: MLSFun
},
fantasmas: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos fantasmas disponibles`,
    function: FantasmasFun
},
amateurs: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos amateurs disponibles`,
    function: EquiposAmateursFun
},
superheroes: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra las camisetas de superhéroes disponibles`,
    function: SuperHeroesFun
},
esports: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `Muestra los equipos de eSports disponibles`,
    function: EquiposEsportsFun
},


// Añadir los nuevos comandos
autoassign: {
    aliases: ['auto'],
    roles: Role.ADMIN_TEMP,
    desc: `
    Este comando activa o desactiva el sistema de asignación automática de jugadores y mapas.`,
    function: toggleAutoAssignCommand,
},
winnerstays: {
    aliases: ['ws'],
    roles: Role.ADMIN_TEMP,
    desc: `
    Este comando activa o desactiva el formato "ganador sigue" donde el equipo ganador se mantiene y los perdedores salen.`,
    function: toggleWinnerStaysCommand,
},


    help: {
        aliases: ['commands'],
        roles: Role.PLAYER,
        desc: `
	This command shows all the available commands. It also can show the description of a command in particular.
Example: \'!help bb\' will show the description of the \'bb\' command.`,
        function: helpCommand,
    },
    claim: {
        aliases: [],
        roles: Role.PLAYER,
        desc: false,
        function: masterCommand,
    },
    afk: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        This command makes you go AFK.
    It has constraints: 1 minute minimum of AFK time, 5 minutes maximum and 10 minutes cooldown.`,
        function: afkCommand,
    },
    afks: {
        aliases: ['afklist'],
        roles: Role.PLAYER,
        desc: `
        This command shows all the players that are AFK.`,
        function: afkListCommand,
    },
    bb: {
        aliases: ['bye', 'gn', 'cya'],
        roles: Role.PLAYER,
        desc: `
	This command makes you leave instantly (use recommended).`,
        function: leaveCommand,
    },
    me: {
        aliases: ['stat', 'stats'],
        roles: Role.PLAYER,
        desc: `
        This command shows your global stats in the room.`,
        function: globalStatsCommand,
    },
    rename: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        This command allows you to rename yourself for the leaderboard.`,
        function: renameCommand,
    },
    games: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        This command shows the top 5 players with the most games in the room.`,
        function: statsLeaderboardCommand,
    },
    wins: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        This command shows the top 5 players with the most wins in the room.`,
        function: statsLeaderboardCommand,
    },
    goals: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        This command shows the top 5 players with the most goals in the room.`,
        function: statsLeaderboardCommand,
    },
    assists: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        This command shows the top 5 players with the most assists in the room.`,
        function: statsLeaderboardCommand,
    },
    cs: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        This command shows the top 5 players with the most CS in the room.`,
        function: statsLeaderboardCommand,
    },
    playtime: {
        aliases: [],
        roles: Role.PLAYER,
        desc: `
        This command shows the top 5 players with the most time played in the room.`,
        function: statsLeaderboardCommand,
    },
    training: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
        This command loads the classic training stadium.`,
        function: stadiumCommand,
    },
    classic: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
        This command loads the classic stadium.`,
        function: stadiumCommand,
    },
    big: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
        This command loads the big stadium.`,
        function: stadiumCommand,
    },
    rr: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
    This command restarts the game.`,
        function: restartCommand,
    },
    rrs: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
    This command swaps the teams and restarts the game.`,
        function: restartSwapCommand,
    },
    swap: {
        aliases: ['s'],
        roles: Role.ADMIN_TEMP,
        desc: `
    This command swaps the teams when the game is stopped.`,
        function: swapCommand,
    },
    kickred: {
        aliases: ['kickr'],
        roles: Role.ADMIN_TEMP,
        desc: `
    This command kicks all the players from the red team, including the player that entered the command. You can give as an argument the reason of the kick.`,
        function: kickTeamCommand,
    },
    kickblue: {
        aliases: ['kickb'],
        roles: Role.ADMIN_TEMP,
        desc: `
    This command kicks all the players from the blue team, including the player that entered the command. You can give as an argument the reason of the kick.`,
        function: kickTeamCommand,
    },
    kickspec: {
        aliases: ['kicks'],
        roles: Role.ADMIN_TEMP,
        desc: `
    This command kicks all the players from the spectators team, including the player that entered the command. You can give as an argument the reason of the kick.`,
        function: kickTeamCommand,
    },
    mute: {
        aliases: ['m'],
        roles: Role.ADMIN_TEMP,
        desc: `
        This command allows to mute a player. He won't be able to talk for a certain duration, and can be unmuted at any time by admins.
    It takes 2 arguments:
    Argument 1: #<id> where <id> is the id of the player targeted. This won't work if the player is an admin.
    Argument 2 (optional): <duration> where <duration> is the duration of the mute in minutes. If no value is provided, the mute lasts for the default duration, ${muteDuration} minutes.
    Example: !mute #3 20 will mute the player with id 3 for 20 minutes.`,
        function: muteCommand,
    },
    unmute: {
        aliases: ['um'],
        roles: Role.ADMIN_TEMP,
        desc: `
        This command allows to unmute someone.
    It takes 1 argument:
    Argument 1: #<id> where <id> is the id of the muted player.
    OR
    Argument 1: <number> where <number> is the number associated with the mute given by the 'muteList' command.
    Example: !unmute #300 will unmute the player with id 300,
             !unmute 8 will unmute the n°8 player according to the 'muteList' command.`,
        function: unmuteCommand,
    },
    mutes: {
        aliases: [],
        roles: Role.ADMIN_TEMP,
        desc: `
        This command shows the list of muted players.`,
        function: muteListCommand,
    },
    clearbans: {
        aliases: [],
        roles: Role.MASTER,
        desc: `
	This command unbans everyone. It also can unban one player in particular, by adding his ID as an argument.`,
        function: clearbansCommand,
    },
    bans: {
        aliases: ['banlist'],
        roles: Role.MASTER,
        desc: `
    This command shows all the players that were banned and their IDs.`,
        function: banListCommand,
    },
    admins: {
        aliases: ['adminlist'],
        roles: Role.MASTER,
        desc: `
    This command shows all the players that are permanent admins.`,
        function: adminListCommand,
    },
    setadmin: {
        aliases: ['admin'],
        roles: Role.MASTER,
        desc: `
    This command allows to set someone as admin. He will be able to connect as admin, and can be removed at any time by masters.
It takes 1 argument:
Argument 1: #<id> where <id> is the id of the player targeted.
Example: !setadmin #3 will give admin to the player with id 3.`,
        function: setAdminCommand,
    },
    removeadmin: {
        aliases: ['unadmin'],
        roles: Role.MASTER,
        desc: `
	This command allows to remove someone as admin.
It takes 1 argument:
Argument 1: #<id> where <id> is the id of the player targeted.
OR
Argument 1: <number> where <number> is the number associated with the admin given by the 'admins' command.
Example: !removeadmin #300 will remove admin to the player with id 300,
         !removeadmin 2 will remove the admin n°2 according to the 'admins' command.`,
        function: removeAdminCommand,
    },
    password: {
        aliases: ['pw'],
        roles: Role.MASTER,
        desc: `
        This command allows to add a password to the room.
    It takes 1 argument:
    Argument 1: <password> where <password> is the password you want for the room.
    
    To remove the room password, simply enter '!password'.`,
        function: passwordCommand,
    },
};

/* GAME */

var lastTouches = Array(2).fill(null);
var lastTeamTouched;

var speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));
var ballSpeed = 0;
var playerRadius = 15;
var ballRadius = 10;
var triggerDistance = playerRadius + ballRadius + 0.01;

/* COLORS */

var welcomeColor = 0xc4ff65;
var announcementColor = 0xffefd6;
var infoColor = 0xbebebe;
var privateMessageColor = 0xffc933;
var redColor = 0xff4c4c;
var blueColor = 0x62cbff;
var warningColor = 0xffa135;
var errorColor = 0xa40000;
var successColor = 0x75ff75;
var defaultColor = null;

/* AUXILIARY */

var checkTimeVariable = false;
var checkStadiumVariable = true;
var endGameVariable = false;
var cancelGameVariable = false;
var kickFetchVariable = false;

var chooseMode = false;
var timeOutCap;
var capLeft = false;
var redCaptainChoice = '';
var blueCaptainChoice = '';
var chooseTime = 20;

var AFKSet = new Set();
var AFKMinSet = new Set();
var AFKCooldownSet = new Set();
var minAFKDuration = 0;
var maxAFKDuration = 30;
var AFKCooldown = 0;

var muteArray = new MuteList();
var muteDuration = 5;

var removingPlayers = false;
var insertingPlayers = false;

var stopTimeout;
var startTimeout;
var unpauseTimeout;
var removingTimeout;
var insertingTimeout;

var emptyPlayer = {
    id: 0,
};
stadiumCommand(emptyPlayer, "!training");

var game = new Game();

/* FUNCTIONS */


// Asegúrate de que esta función exista
function getOrCreateRecoveryCode(auth) {
    // Si ya existe un mapa de códigos de recuperación, úsalo
    if (typeof recoveryCodeMap === 'undefined') {
        recoveryCodeMap = {};
    }
    
    if (typeof authToCodeMap === 'undefined') {
        authToCodeMap = {};
    }
    
    // Si ya existe un código para este auth, devolverlo
    if (authToCodeMap[auth]) {
        return authToCodeMap[auth];
    }
    
    // Generar un nuevo código usando la función existente o una nueva
    let code;
    if (typeof generateRecoveryCode === 'function') {
        // Usar la función existente
        code = generateRecoveryCode();
    } else {
        // Crear un código de 5 caracteres
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    
    // Asegurarse de que el código sea único
    while (recoveryCodeMap[code]) {
        if (typeof generateRecoveryCode === 'function') {
            code = generateRecoveryCode();
        } else {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            code = '';
            for (let i = 0; i < 5; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
    }
    
    // Guardar el código en ambos mapas
    recoveryCodeMap[code] = auth;
    authToCodeMap[auth] = code;
    
    // Intentar guardar en localStorage
    try {
        localStorage.setItem('recoveryCodeMap', JSON.stringify(recoveryCodeMap));
        localStorage.setItem('authToCodeMap', JSON.stringify(authToCodeMap));
    } catch (e) {
        console.log("No se pudo guardar códigos en localStorage");
    }
    
    return code;
}

// Cargar los códigos de recuperación al iniciar
try {
    const storedRecoveryCodes = localStorage.getItem('recoveryCodeMap');
    const storedAuthCodes = localStorage.getItem('authToCodeMap');
    
    if (storedRecoveryCodes && storedAuthCodes) {
        recoveryCodeMap = JSON.parse(storedRecoveryCodes);
        authToCodeMap = JSON.parse(storedAuthCodes);
    }
} catch (e) {
    console.log("No se pudieron cargar los códigos de recuperación");
}
// Función para generar un código de recuperación aleatorio
function generateRecoveryCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin caracteres confusos como I, O, 0, 1
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
// Comando para obtener un código de recuperación
function getRecoveryCodeCommand(player, message) {
    if (!authArray[player.id]) {
        room.sendAnnouncement("Necesitas estar autenticado para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    const playerAuth = authArray[player.id][0];
    const existingCode = Object.keys(recoveryCodeMap).find(code => recoveryCodeMap[code] === playerAuth);
    
    if (existingCode) {
        room.sendAnnouncement(`Tu código de recuperación es: ${existingCode}`, player.id, 0x00FF00);
        room.sendAnnouncement("Guarda este código! Lo necesitarás para recuperar tus estadísticas en otro navegador.", player.id, 0x00FF00);
    } else {
        const newCode = generateRecoveryCode();
        recoveryCodeMap[newCode] = playerAuth;
        
        room.sendAnnouncement(`Tu código de recuperación es: ${newCode}`, player.id, 0x00FF00);
        room.sendAnnouncement("Guarda este código! Lo necesitarás para recuperar tus estadísticas en otro navegador.", player.id, 0x00FF00);
    }
    
    return false;
}

function useRecoveryCodeCommand(player, message) {
    console.log("Ejecutando comando recover con mensaje:", message);
    
    let args = message.split(" ");
    if (args.length < 2) {
        console.log("Faltan argumentos");
        room.sendAnnouncement("⚠️ Uso: !recover [código]", player.id, 0xFFAA00, "bold", HaxNotification.CHAT);
        return false;
    }
    
    let code = args[1].toUpperCase();
    console.log("Código a buscar:", code);
    console.log("Mapa de códigos:", recoveryCodeMap);
    
    let auth = recoveryCodeMap[code];
    console.log("Auth encontrado:", auth);
    if (!auth) {
        room.sendAnnouncement("❌ Código de recuperación no válido.", player.id, 0xFF0000, "bold", HaxNotification.CHAT);
        return false;
    }
    
    // Obtener estadísticas asociadas al código
    let stats = null;
    if (statsDatabase && statsDatabase[auth]) {
        stats = statsDatabase[auth];
    } else if (statsVariable && statsVariable[auth]) {
        stats = statsVariable[auth];
    }
    
    // Verificar si se encontraron estadísticas
    if (!stats) {
        room.sendAnnouncement("❌ No hay estadísticas asociadas a este código.", player.id, 0xFF0000, "bold", HaxNotification.CHAT);
        return false;
    }
    
    // Obtener auth del jugador actual
    const playerAuth = player.auth || "unauth";
    if (playerAuth === "unauth") {
        room.sendAnnouncement("❌ Necesitas estar autenticado para recuperar estadísticas.", player.id, 0xFF0000, "bold", HaxNotification.CHAT);
        return false;
    }
    
    // Combinar estadísticas si el jugador ya tiene algunas
    let currentStats = statsDatabase[playerAuth] || statsVariable[playerAuth] || {};
    
    // Función para sumar estadísticas numéricas
    function combineStats(current, recovered) {
        return {
            games: (current.games || 0) + (recovered.games || 0),
            wins: (current.wins || 0) + (recovered.wins || 0),
            goals: (current.goals || 0) + (recovered.goals || 0),
            assists: (current.assists || 0) + (recovered.assists || 0),
            ownGoals: (current.ownGoals || 0) + (recovered.ownGoals || 0),
            playtime: (current.playtime || 0) + (recovered.playtime || 0),
            CS: (current.CS || 0) + (recovered.CS || 0),
            // Mantener el nombre actual
            playerName: current.playerName || player.name
        };
    }
    
    // Combinar las estadísticas
    let combinedStats = combineStats(currentStats, stats);
    
    // Actualizar las estadísticas en ambas bases de datos
    if (typeof statsDatabase !== 'undefined') {
        statsDatabase[playerAuth] = combinedStats;
    }
    
    if (typeof statsVariable !== 'undefined') {
        statsVariable[playerAuth] = combinedStats;
    }
    
    // Guardar en localStorage si está disponible
    try {
        localStorage.setItem('statsDatabase', JSON.stringify(statsDatabase));
    } catch (e) {
        console.log("Error al guardar estadísticas:", e);
    }
    
    // Crear un nuevo código para el jugador
    const newCode = getOrCreateRecoveryCode(playerAuth);
    
    // Eliminar el código antiguo
    delete recoveryCodeMap[code];
    
    room.sendAnnouncement("✅ ¡Estadísticas recuperadas con éxito!", player.id, 0x00FF00, "bold", HaxNotification.CHAT);
    room.sendAnnouncement(`🔑 Tu nuevo código de recuperación es: ${newCode}`, player.id, 0x00AAFF, "bold", HaxNotification.CHAT);
    
    return false;
}


// Función para formatear tiempo
function formatTime(seconds) {
    if (seconds < 60) return `${seconds} segundos`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutos`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
        return `${hours} hora${hours !== 1 ? 's' : ''}`;
    }
    
    return `${hours} hora${hours !== 1 ? 's' : ''} y ${remainingMinutes} minuto${remainingMinutes !== 1 ? 's' : ''}`;
}


// Función para cargar códigos de recuperación desde GitHub
function loadRecoveryCodes() {
    fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}?ref=${GITHUB_CONFIG.branch}`, {
        headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => {
        if (!response.ok) {
            // Si el archivo no existe (404) u otro error
            if (response.status === 404) {
                console.log('El archivo de códigos de recuperación no existe todavía, se creará uno nuevo');
                recoveryCodeMap = {}; // Inicializar con un objeto vacío
                // Guardar para crear el archivo
                saveRecoveryCodes();
                return Promise.reject(new Error('Archivo no encontrado, se creará uno nuevo'));
            }
            return Promise.reject(new Error(`Error en la petición: ${response.status}`));
        }
        return response.json();
    })
    .then(data => {
        try {
            // Verificar que data.content existe
            if (!data.content) {
                console.error('No se encontró contenido en la respuesta de GitHub');
                recoveryCodeMap = {};
                return;
            }
            
            // Decodificar el contenido en base64
            const content = atob(data.content);
            recoveryCodeMap = JSON.parse(content);
            console.log('Códigos de recuperación cargados desde GitHub');
        } catch (error) {
            console.error('Error al procesar datos de GitHub:', error);
            recoveryCodeMap = {};
        }
    })
    .catch(error => {
        console.error('Error al cargar códigos desde GitHub:', error);
        // Inicializar con un objeto vacío
        recoveryCodeMap = {};
    });
}

// Función para guardar códigos de recuperación en GitHub
function saveRecoveryCodes() {
    const recoveryCodes = JSON.stringify(recoveryCodeMap, null, 2);
    
    // Primero, verificar si el archivo existe
    fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}?ref=${GITHUB_CONFIG.branch}`, {
        headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else if (response.status === 404) {
            // El archivo no existe, crearlo
            return createNewFile(recoveryCodes);
        } else {
            return Promise.reject(new Error(`Error al verificar archivo: ${response.status}`));
        }
    })
    .then(data => {
        if (data && data.sha) {
            // Actualizar el archivo existente
            return updateExistingFile(recoveryCodes, data.sha);
        }
    })
    .catch(error => {
        console.error('Error en saveRecoveryCodes:', error);
    });
}

// Función auxiliar para crear un nuevo archivo
function createNewFile(content) {
    return fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Crear archivo de códigos de recuperación',
            content: btoa(unescape(encodeURIComponent(content))),  // Codificar en base64 de manera segura
            branch: GITHUB_CONFIG.branch
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al crear archivo: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('Archivo de códigos de recuperación creado en GitHub');
        return result;
    });
}

// Función auxiliar para actualizar un archivo existente
function updateExistingFile(content, sha) {
    return fetch(`${GITHUB_CONFIG.apiBaseUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Actualizar códigos de recuperación',
            content: btoa(unescape(encodeURIComponent(content))),  // Codificar en base64 de manera segura
            sha: sha,
            branch: GITHUB_CONFIG.branch
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al actualizar archivo: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('Códigos de recuperación actualizados en GitHub');
        return result;
    });
}
/* AUXILIARY FUNCTIONS */

if (typeof String.prototype.replaceAll != 'function') {
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
}

function getDate() {
    let d = new Date();
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

/* MATH FUNCTIONS */

function getRandomInt(max) {
    // returns a random number between 0 and max-1
    return Math.floor(Math.random() * Math.floor(max));
}

function pointDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/* TIME FUNCTIONS */

function getHoursStats(time) {
    return Math.floor(time / 3600);
}

function getMinutesGame(time) {
    var t = Math.floor(time / 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
}

function getMinutesReport(time) {
    return Math.floor(Math.round(time) / 60);
}

function getMinutesEmbed(time) {
    var t = Math.floor(Math.round(time) / 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
}

function getMinutesStats(time) {
    return Math.floor(time / 60) - getHoursStats(time) * 60;
}

function getSecondsGame(time) {
    var t = Math.floor(time - Math.floor(time / 60) * 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
}

function getSecondsReport(time) {
    var t = Math.round(time);
    return Math.floor(t - getMinutesReport(t) * 60);
}

function getSecondsEmbed(time) {
    var t = Math.round(time);
    var t2 = Math.floor(t - Math.floor(t / 60) * 60);
    return `${Math.floor(t2 / 10)}${Math.floor(t2 % 10)}`;
}

function getTimeGame(time) {
    return `[${getMinutesGame(time)}:${getSecondsGame(time)}]`;
}

function getTimeEmbed(time) {
    return `[${getMinutesEmbed(time)}:${getSecondsEmbed(time)}]`;
}

function getTimeStats(time) {
    if (getHoursStats(time) > 0) {
        return `${getHoursStats(time)}h${getMinutesStats(time)}m`;
    } else {
        return `${getMinutesStats(time)}m`;
    }
}

function getGoalGame() {
    return game.scores.red + game.scores.blue;
}

/* REPORT FUNCTIONS */

function findFirstNumberCharString(str) {
    let str_number = str[str.search(/[0-9]/g)];
    return str_number === undefined ? "0" : str_number;
}

function getIdReport() {
    var d = new Date();
    return `${d.getFullYear() % 100}${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}${d.getDate() < 10 ? '0' : ''}${d.getDate()}${d.getHours() < 10 ? '0' : ''}${d.getHours()}${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}${d.getSeconds() < 10 ? '0' : ''}${d.getSeconds()}${findFirstNumberCharString(roomName)}`;
}

function spyCommand(player, message) {
    if (!hasPermission(player, Role.ADMIN_PERM)) {
        room.sendAnnouncement("No tienes permiso para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    // Alternar modo espía
    if (spyModeEnabled.has(player.id)) {
        spyModeEnabled.delete(player.id);
        room.sendAnnouncement("🔴 Modo espía desactivado. Ya no verás mensajes privados y de equipo.", player.id, 0xFF9900);
    } else {
        spyModeEnabled.add(player.id);
        room.sendAnnouncement("🟢 Modo espía activado. Ahora verás mensajes privados y de equipo.", player.id, 0x00FF00);
    }
    
    return false;
}

function getRecordingName(game) {
    let d = new Date();
    let redCap = game.playerComp[0][0] != undefined ? game.playerComp[0][0].player.name : 'Red';
    let blueCap = game.playerComp[1][0] != undefined ? game.playerComp[1][0].player.name : 'Blue';
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let month = d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let year = d.getFullYear() % 100 < 10 ? '0' + (d.getFullYear() % 100) : (d.getFullYear() % 100);
    let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    return `${day}-${month}-${year}-${hour}h${minute}-${redCap}vs${blueCap}.hbr2`;
}

function fetchRecording(game) {
    if (gameWebhook != "") {
        let form = new FormData();
        form.append(null, new File([game.rec], getRecordingName(game), { "type": "text/plain" }));
        form.append("payload_json", JSON.stringify({
            "username": roomName
        }));

        fetch(gameWebhook, {
            method: 'POST',
            body: form,
        }).then((res) => res);
    }
}

/* FEATURE FUNCTIONS */

function getCommand(commandStr) {
    if (commands.hasOwnProperty(commandStr)) return commandStr;
    for (const [key, value] of Object.entries(commands)) {
        for (let alias of value.aliases) {
            if (alias == commandStr) return key;
        }
    }
    return false;
}

function getPlayerComp(player) {
    if (player == null || player.id == 0) return null;
    var comp = game.playerComp;
    var index = comp[0].findIndex((c) => c.auth == authArray[player.id][0]);
    if (index != -1) return comp[0][index];
    index = comp[1].findIndex((c) => c.auth == authArray[player.id][0]);
    if (index != -1) return comp[1][index];
    return null;
}

function getTeamArray(team, includeAFK = true) {
    if (team == Team.RED) return teamRed;
    if (team == Team.BLUE) return teamBlue;
    if (includeAFK) {
      return playersAll.filter((p) => p.team === Team.SPECTATORS);
    }
    return teamSpec;
}

function sendAnnouncementTeam(message, team, color, style, mention) {
    for (let player of team) {
        room.sendAnnouncement(message, player.id, color, style, mention);
    }
}

function teamChat(player, message) {
    let msgArray = message.split(/ +/);
    let teamMsg = message.substring(message.indexOf(" ") + 1);
    
    // Enviar mensaje a los compañeros de equipo
    let players = room.getPlayerList();
    for (let i = 0; i < players.length; i++) {
        if (players[i].team === player.team) {
            let icon = (player.team === Team.RED) ? '🔴' : (player.team === Team.BLUE) ? '🔵' : '⚪';
            room.sendAnnouncement(`${icon} EQUIPO ${player.name}: ${teamMsg}`, players[i].id, (player.team === Team.RED) ? 0xFF0000 : (player.team === Team.BLUE) ? 0x0000FF : 0xFFFFFF, "bold");
        } 
        // Enviar a espías que NO están en el mismo equipo
        else if (spyModeEnabled.has(players[i].id) && players[i].team !== player.team) {
            let teamName = (player.team === Team.RED) ? "🔴 ROJO" : (player.team === Team.BLUE) ? "🔵 AZUL" : "⚪ ESPECTADOR";
            room.sendAnnouncement(`[SPY] [EQUIPO ${teamName}] ${player.name}: ${teamMsg}`, players[i].id, 0x888888);
        }
    }
    
    return false;
}
function vipChatCommand(player, message) {
    if (!hasPermission(player, Role.OWNER)) {
        room.sendAnnouncement("No tienes permiso para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    let vipMessage = "";
    
    // Obtener el mensaje después de !vip o vip
    if (message.startsWith("!vip ")) {
        vipMessage = message.substring(5);
    } else if (message.startsWith("vip ")) {
        vipMessage = message.substring(4);
    } else {
        room.sendAnnouncement("Uso: !vip [mensaje] o vip [mensaje]", player.id, 0xFF0000);
        return false;
    }
    
    if (vipMessage.trim() === "") {
        room.sendAnnouncement("El mensaje no puede estar vacío.", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener el rol del emisor para el prefijo
    let roleName = getRoleName(getRole(player));
    
    // Enviar el mensaje solo a los roles importantes (OWNER+)
    let players = room.getPlayerList();
    for (let i = 0; i < players.length; i++) {
        if (hasPermission(players[i], Role.OWNER)) {
            room.sendAnnouncement(`[VIP CHAT] ${roleName} ${player.name}: ${vipMessage}`, players[i].id, 0xFF00FF, "bold");
        }
    }
    
    return false;
}

// Función para mensajes privados mejorada
function playerChat(player, message) {
    // Verificar si el formato del mensaje es correcto (@@nick o @@#id)
    const privateMatch = message.match(/^@@(#?[0-9]+|[^\s]+)\s+(.+)$/);
    
    if (!privateMatch) {
        room.sendAnnouncement(
            "❌ Formato incorrecto. Usa @@nombre mensaje o @@#ID mensaje",
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
        );
        return false;
    }
    
    // Extraer el destinatario y el mensaje
    const targetStr = privateMatch[1];
    const messageContent = privateMatch[2];
    let targetPlayer = null;
    
    // Verificar si es por ID o por nombre
    if (targetStr.startsWith('#')) {
        // Es por ID (formato: @@#5)
        const playerId = parseInt(targetStr.substring(1));
        if (!isNaN(playerId)) {
            targetPlayer = room.getPlayer(playerId);
        }
    } else if (/^\d+$/.test(targetStr)) {
        // Es solo un número sin # (formato: @@5)
        const playerId = parseInt(targetStr);
        if (!isNaN(playerId)) {
            targetPlayer = room.getPlayer(playerId);
        }
    } else {
        // Es por nombre (formato: @@Jorgito)
        const nameToFind = targetStr.toLowerCase();
        const players = room.getPlayerList();
        for (let p of players) {
            if (p.name.toLowerCase().includes(nameToFind)) {
                targetPlayer = p;
                break;
            }
        }
    }
    
    // Verificar si se encontró al jugador
    if (!targetPlayer) {
        room.sendAnnouncement(
            `❌ No se encontró al jugador: ${targetStr}`,
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
        );
        return false;
    }
    
    // Verificar que el mensaje no esté vacío
    if (!messageContent.trim()) {
        room.sendAnnouncement(
            "❌ El mensaje no puede estar vacío.",
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
        );
        return false;
    }
    
    // Enviar mensaje al destinatario
    room.sendAnnouncement(
        `🔒 DM de ${player.name}: ${messageContent}`,
        targetPlayer.id,
        0xFFFF00,
        "bold",
        HaxNotification.CHAT
    );
    
    // Enviar confirmación al remitente
    room.sendAnnouncement(
        `🔒 DM a ${targetPlayer.name}: ${messageContent}`,
        player.id,
        0xFFFF00,
        "bold",
        HaxNotification.CHAT
    );
    
    // Enviar a espías (si existe la funcionalidad)
    if (typeof spyModeEnabled !== 'undefined') {
        const spyPlayers = room.getPlayerList().filter(p => 
            typeof spyModeEnabled.has === 'function' && 
            spyModeEnabled.has(p.id) && 
            p.id !== player.id && 
            p.id !== targetPlayer.id &&
            (typeof hasPermission === 'function' ? 
                hasPermission(p, Role.ADMIN_PERM) : true)
        );
        
        for (let spy of spyPlayers) {
            room.sendAnnouncement(
                `[SPY] [DM] ${player.name} → ${targetPlayer.name}: ${messageContent}`,
                spy.id,
                0x888888,
                "normal",
                HaxNotification.CHAT
            );
        }
    }
    
    return false;
}
/* PHYSICS FUNCTIONS */

function calculateStadiumVariables() {
    if (checkStadiumVariable && teamRed.length + teamBlue.length > 0) {
        checkStadiumVariable = false;
        setTimeout(() => {
            let ballDisc = room.getDiscProperties(0);
            let playerDisc = room.getPlayerDiscProperties(teamRed.concat(teamBlue)[0].id);
            ballRadius = ballDisc.radius;
            playerRadius = playerDisc.radius;
            triggerDistance = ballRadius + playerRadius + 0.01;
            speedCoefficient = 100 / (5 * ballDisc.invMass * (ballDisc.damping ** 60 + 1));
        }, 1);
    }
}

function checkGoalKickTouch(array, index, goal) {
    if (array != null && array.length >= index + 1) {
        var obj = array[index];
        if (obj != null && obj.goal != null && obj.goal == goal) return obj;
    }
    return null;
}

/* BUTTONS */

function topButton() {
    if (teamSpec.length > 0) {
        if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
            room.setPlayerTeam(teamSpec[0].id, Team.RED);
            room.setPlayerTeam(teamSpec[1].id, Team.BLUE);
        } else if (teamRed.length < teamBlue.length)
            room.setPlayerTeam(teamSpec[0].id, Team.RED);
        else room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
    }
}

function randomButton() {
    if (teamSpec.length > 0) {
        if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
            var r = getRandomInt(teamSpec.length);
            room.setPlayerTeam(teamSpec[r].id, Team.RED);
            teamSpec = teamSpec.filter((spec) => spec.id != teamSpec[r].id);
            room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.BLUE);
        } else if (teamRed.length < teamBlue.length)
            room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.RED);
        else
            room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.BLUE);
    }
}

function blueToSpecButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (var i = 0; i < teamBlue.length; i++) {
        room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS);
    }
}

function redToSpecButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (var i = 0; i < teamRed.length; i++) {
        room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
    }
}

function resetButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (let i = 0; i < Math.max(teamRed.length, teamBlue.length); i++) {
        if (Math.max(teamRed.length, teamBlue.length) - teamRed.length - i > 0)
            room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS);
        else if (Math.max(teamRed.length, teamBlue.length) - teamBlue.length - i > 0)
            room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
        else break;
    }
    for (let i = 0; i < Math.min(teamRed.length, teamBlue.length); i++) {
        room.setPlayerTeam(
            teamBlue[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
            Team.SPECTATORS
        );
        room.setPlayerTeam(
            teamRed[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
            Team.SPECTATORS
        );
    }
}

function swapButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
        removingPlayers = false;
    }, 100);
    for (let player of teamBlue) {
        room.setPlayerTeam(player.id, Team.RED);
    }
    for (let player of teamRed) {
        room.setPlayerTeam(player.id, Team.BLUE);
    }
}

/* COMMAND FUNCTIONS */

/* PLAYER COMMANDS */

function leaveCommand(player, message) {
    room.kickPlayer(player.id, 'Bye !', false);
}

function helpCommand(player, message) {
    let msgArray = message.split(" ");
    
    // Si se especifica un comando, mostrar su descripción específica
    if (msgArray.length > 1) {
        let command = getCommand(msgArray[1].toLowerCase());
        if (command != false && commands[command].desc != false) {
            room.sendAnnouncement(
                `📌 Comando: !${msgArray[1].toLowerCase()}\n📝 Descripción: ${commands[command].desc}`,
                player.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            return;
        }
        else {
            room.sendAnnouncement(
                `❌ ¡El comando que intentaste verificar no existe! Usa !help para ver los comandos disponibles.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            return;
        }
    }

    // Si no se especifica comando, mostrar lista categorizada de comandos
    let role = getRole(player);
    
    // Crear categorías de comandos
    let categories = {
        "📊 ESTADÍSTICAS": [],
        "🎮 JUEGO": [],
        "👕 EQUIPOS": [],
        "💬 CHAT": [],
        "🛠️ UTILIDADES": [],
        "🔒 ADMIN": []
    };
    
    // Clasificar comandos por categoría
    for (const [key, value] of Object.entries(commands)) {
        if (value.desc !== false && value.roles <= role) {
            // Clasificar comandos según su funcionalidad
            if (["me", "stats", "goals", "assists", "wins", "games", "cs", "playtime"].includes(key)) {
                categories["📊 ESTADÍSTICAS"].push(key);
            } 
            else if (["rr", "swap", "training", "classic", "big", "afk"].includes(key)) {
                categories["🎮 JUEGO"].push(key);
            }
            else if (["camisetas", "conmebol", "uefa", "primera", "ascenso", "superlig", "paises",
                     "laliga", "seriea", "brasileirao", "premierleague", "bundesliga", "ligue1", "eredivisie"].includes(key)) {
                categories["👕 EQUIPOS"].push(key);
            }
            else if (["ac", "vip", "mute", "unmute", "mutes", "ban", "tempban", "kick", "banlist", "clearbans"].includes(key)) {
                categories["🔒 ADMIN"].push(key);
            }
            else if (["recoverycode", "recover", "rename", "adminhelp", "level"].includes(key)) {
                categories["🛠️ UTILIDADES"].push(key);
            }
            else {
                categories["💬 CHAT"].push(key);
            }
        }
    }
    
    // Construir y enviar mensaje con categorías
    room.sendAnnouncement(
        `╔══════════ 📚 COMANDOS DISPONIBLES 📚 ══════════╗`,
        player.id,
        0x6FC9DD, // Azul claro
        'bold',
        HaxNotification.CHAT
    );
    
    // Mostrar cada categoría
    let categoryNumber = 1;
    for (const [category, cmdList] of Object.entries(categories)) {
        if (cmdList.length > 0) {
            // Ordenar comandos alfabéticamente
            cmdList.sort();
            
            // Crear string con comandos separados por espacios
            let commandsStr = cmdList.map(cmd => `!${cmd}`).join("  ");
            
            // Enviar cabecera de categoría
            room.sendAnnouncement(
                `║ ${categoryNumber}. ${category}`,
                player.id,
                0x6FC9DD,
                'bold',
                HaxNotification.CHAT
            );
            
            // Enviar comandos con sangrías
            room.sendAnnouncement(
                `║    ${commandsStr}`,
                player.id,
                0x70D1F4,
                'normal',
                HaxNotification.CHAT
            );
            
            categoryNumber++;
        }
    }
    
    // Si es admin, mostrar recordatorio sobre comandos admin
    if (role >= Role.ADMIN_TEMP) {
        room.sendAnnouncement(
            `║\n║ 💡 Usa !adminhelp para ver más comandos administrativos`,
            player.id,
            0x6FC9DD,
            'bold',
            HaxNotification.CHAT
        );
    }
    
    // Cerrar el cuadro
    room.sendAnnouncement(
        `╚═══════════════════════════════════════════════╝`,
        player.id,
        0x6FC9DD,
        'bold',
        HaxNotification.CHAT
    );
}
// Función para obtener todos los comandos administrativos disponibles para un rol
function getAllAdminCommands(role) {
    let adminCommands = [];
    for (const [key, value] of Object.entries(commands)) {
        if (value.desc !== false && value.roles >= Role.ADMIN_TEMP && value.roles <= role) {
            adminCommands.push(key);
        }
    }
    return adminCommands;
}

// Nueva función para mostrar comandos administrativos
function adminHelpCommand(player, message) {
    let role = getRole(player);
    
    if (role < Role.ADMIN_TEMP) {
        room.sendAnnouncement(
            `No tienes permiso para ver los comandos administrativos.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return;
    }
    
    let msgArray = message.split(" ");
    
    // Si se especifica un comando, mostrar su descripción específica
    if (msgArray.length > 1) {
        let command = getCommand(msgArray[1].toLowerCase());
        if (command != false && commands[command].desc != false && commands[command].roles >= Role.ADMIN_TEMP) {
            room.sendAnnouncement(
                `Comando Admin: ${msgArray[1].toLowerCase()} | Descripción: ${commands[command].desc}`,
                player.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            return;
        }
        else {
            room.sendAnnouncement(
                `¡El comando administrativo que intentaste verificar no existe! Usa !adminhelp para ver los comandos disponibles.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            return;
        }
    }
    
    // Agrupar comandos por roles
    let adminCommands = {
        [Role.ADMIN_TEMP]: [],
        [Role.ADMIN_PERM]: [],
        [Role.SUPERADMIN]: [],
        [Role.CO_OWNER]: [],
        [Role.OWNER]: [],
        [Role.MASTER]: []
    };
    
    // Clasificar comandos por rol requerido
    for (const [key, value] of Object.entries(commands)) {
        if (value.desc !== false && value.roles >= Role.ADMIN_TEMP && value.roles <= role) {
            adminCommands[value.roles].push(key);
        }
    }
    
    // Mostrar comandos por categoría
    let roleNames = {
        [Role.ADMIN_TEMP]: "ADMIN TEMPORAL",
        [Role.ADMIN_PERM]: "ADMIN PERMANENTE",
        [Role.SUPERADMIN]: "SUPER ADMIN",
        [Role.CO_OWNER]: "CO-OWNER",
        [Role.OWNER]: "OWNER",
        [Role.MASTER]: "MASTER"
    };
    
    for (let roleValue in adminCommands) {
        roleValue = parseInt(roleValue);
        if (roleValue <= role && adminCommands[roleValue].length > 0) {
            let commandString = `${roleNames[roleValue]}: `;
            adminCommands[roleValue].forEach((cmd, index) => {
                if (index > 0) commandString += ", ";
                commandString += "!" + cmd;
            });
            
            room.sendAnnouncement(
                commandString,
                player.id,
                // Usar diferentes colores según el nivel del rol
                roleValue === Role.MASTER ? 0xFF00FF :
                roleValue === Role.OWNER ? 0xFF0000 :
                roleValue === Role.CO_OWNER ? 0xFF9900 :
                roleValue === Role.SUPERADMIN ? 0x00FF00 :
                roleValue === Role.ADMIN_PERM ? 0x00FFFF :
                0x6c6a76,
                'bold',
                HaxNotification.CHAT
            );
        }
    }
    
    // Instrucciones adicionales
    room.sendAnnouncement(
        `Para ver detalles de un comando específico, usa !adminhelp [comando]`,
        player.id,
        infoColor,
        'normal',
        HaxNotification.CHAT
    );
}



function renameCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (localStorage.getItem(authArray[player.id][0])) {
        var stats = JSON.parse(localStorage.getItem(authArray[player.id][0]));
        if (msgArray.length == 0) {
            stats.playerName = player.name;
        } else {
            stats.playerName = msgArray.join(' ');
        }
        localStorage.setItem(authArray[player.id][0], JSON.stringify(stats));
        room.sendAnnouncement(
            `You successfully renamed yourself ${stats.playerName} !`,
            player.id,
            successColor,
            'bold',
            HaxNotification.CHAT
        );
    } else {
        room.sendAnnouncement(
            `You haven't played a game in this room yet !`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function statsLeaderboardCommand(player, message) {
    var key = message.split(/ +/)[0].substring(1).toLowerCase();
    printRankings(key, player.id);
}


// Función para el comando !me con formato elaborado y estética mejorada
function globalStatsCommand(player, message) {
    var stats = new HaxStatistics(player.name);
    if (localStorage.getItem(authArray[player.id][0])) {
        stats = JSON.parse(localStorage.getItem(authArray[player.id][0]));
    }
    
    // Calcular porcentaje de victorias
    const winPercentage = ((stats.wins / (stats.games || 1)) * 100).toFixed(2);
    
    // Formatear tiempo de juego
    let playtime = stats.playtime ? getTimeStats(stats.playtime) : "0 minutos";
    
    // Crear código de recuperación si no existe
    let recoveryCode = "N/A";
    try {
        if (authArray[player.id] && authArray[player.id][0]) {
            recoveryCode = getOrCreateRecoveryCode(authArray[player.id][0]);
        }
    } catch (e) {
        recoveryCode = "Error al generar";
    }
    
    // Generar un ID único
    const uniqueId = Math.floor(Math.random() * 90000) + 10000;
    
    // Calcular ratio de goles por partidos
    const goalsPerGame = stats.games > 0 ? (stats.goals / stats.games).toFixed(2) : "0.00";
    
    // Construir mensaje con estilo visual único
    room.sendAnnouncement(
        `╔═══════ 📊 PERFIL DE JUGADOR 📊 ═══════╗
║ 👤 ${player.name}
╠═════════════════════════════════════
║ 📈 RÉCORD
║ ├─ 🏆 Victorias: ${stats.wins || 0}
║ ├─ 📉 Derrotas: ${(stats.games || 0) - (stats.wins || 0)}
║ ├─ 🎯 Ratio: ${winPercentage}%
║ └─ 🎮 Total Partidos: ${stats.games || 0}
╠═════════════════════════════════════
║ 🥇 CONTRIBUCIONES
║ ├─ ⚽ Goles: ${stats.goals || 0} (${goalsPerGame} por partido)
║ ├─ 👟 Asistencias: ${stats.assists || 0}
║ ├─ 🤦‍♂️ Autogoles: ${stats.ownGoals || 0}
║ └─ 🧤 Vallas invictas: ${stats.CS || 0}
╠═════════════════════════════════════
║ ⌛ TIEMPO DE JUEGO
║ └─ ⏱️ ${playtime}
╠═════════════════════════════════════
║ 🔐 SEGURIDAD
║ ├─ 🆔 ${uniqueId}
║ └─ 🔑 ${recoveryCode}
╚═════════════════════════════════════
💡 Guarda tu código y úsalo con !recuperar`,
        player.id,
        0x4DA6FF, // Azul más vivo
        'bold',
        HaxNotification.CHAT
    );
}
// Función para actualizar estadísticas
function updatePlayerStats(auth, updates) {
    const stats = getPlayerStats(auth);
    
    // Aplicar actualizaciones
    for (const [key, value] of Object.entries(updates)) {
        stats[key] = value;
    }
    
    // Guardar si es necesario
    try {
        localStorage.setItem('statsDatabase', JSON.stringify(statsDatabase));
    } catch (e) {
        console.log("Error al guardar estadísticas");
    }
}

// Agrega esta función después de la función updatePlayerStats
function updateStats() {
    if (
        players.length >= 2 * teamSize &&
        (
            game.scores.time >= (5 / 6) * game.scores.timeLimit ||
            game.scores.red == game.scores.scoreLimit ||
            game.scores.blue == game.scores.scoreLimit
        ) &&
        teamRedStats.length >= teamSize && teamBlueStats.length >= teamSize
    ) {
        for (let player of teamRedStats) {
            updatePlayerStats(player, Team.RED);
        }
        for (let player of teamBlueStats) {
            updatePlayerStats(player, Team.BLUE);
        }
    }
}
function afkCommand(player, message) {
    if (player.team == Team.SPECTATORS || players.length == 1) {
        if (AFKSet.has(player.id)) {
            if (AFKMinSet.has(player.id)) {
                room.sendAnnouncement(
                    `There is a minimum of ${minAFKDuration} minute of AFK time. Don't abuse the command !`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else {
                AFKSet.delete(player.id);
                room.sendAnnouncement(
                    `🌅 ${player.name} is not AFK anymore !`,
                    null,
                    announcementColor,
                    'bold',
                    null
                );
                updateTeams();
                handlePlayersJoin();
            }
        } else {
            if (AFKCooldownSet.has(player.id)) {
                room.sendAnnouncement(
                    `You can only go AFK every ${AFKCooldown} minutes. Don't abuse the command !`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else {
                AFKSet.add(player.id);
                if (!player.admin) {
                    AFKMinSet.add(player.id);
                    AFKCooldownSet.add(player.id);
                    setTimeout(
                        (id) => {
                            AFKMinSet.delete(id);
                        },
                        minAFKDuration * 60 * 1000,
                        player.id
                    );
                    setTimeout(
                        (id) => {
                            AFKSet.delete(id);
                        },
                        maxAFKDuration * 60 * 1000,
                        player.id
                    );
                    setTimeout(
                        (id) => {
                            AFKCooldownSet.delete(id);
                        },
                        AFKCooldown * 60 * 1000,
                        player.id
                    );
                }
                room.setPlayerTeam(player.id, Team.SPECTATORS);
                room.sendAnnouncement(
                    `😴 ${player.name} is now AFK !`,
                    null,
                    announcementColor,
                    'bold',
                    null
                );
                updateTeams();
                handlePlayersLeave();
            }
        }
    } else {
        room.sendAnnouncement(
            `You can't go AFK while in a team !`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function afkListCommand(player, message) {
    if (AFKSet.size == 0) {
        room.sendAnnouncement(
            "😴 There's nobody in the AFK list.",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return;
    }
    var cstm = '😴 AFK list : ';
    AFKSet.forEach((_, value) => {
        var p = room.getPlayer(value);
        if (p != null) cstm += p.name + `, `;
    });
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(cstm, player.id, announcementColor, 'bold', null);
}

function masterCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (parseInt(msgArray[0]) == masterPassword) {
        if (!masterList.includes(authArray[player.id][0])) {
            room.setPlayerAdmin(player.id, true);
            adminList = adminList.filter((a) => a[0] != authArray[player.id][0]);
            masterList.push(authArray[player.id][0]);
            room.sendAnnouncement(
                `${player.name} is now a room master !`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `You are a master already !`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }
}

/* ADMIN COMMANDS */

function restartCommand(player, message) {
    instantRestart();
}

function restartSwapCommand(player, message) {
    room.stopGame();
    swapButton();
    startTimeout = setTimeout(() => {
        room.startGame();
    }, 10);
}

function swapCommand(player, message) {
    if (playSituation == Situation.STOP) {
        swapButton();
        room.sendAnnouncement(
            '✔️ Teams swapped !',
            null,
            announcementColor,
            'bold',
            null
        );
    } else {
        room.sendAnnouncement(
            `Please stop the game before swapping.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function banCommand(player, message) {
    if (!hasPermission(player, Role.ADMIN_PERM)) {
        room.sendAnnouncement("No tienes permiso para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    if (args.length < 2) {
        room.sendAnnouncement("Uso: !ban #[id] [razón opcional]", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener el ID del jugador a banear
    let targetId = parseInt(args[1].substring(1));
    if (isNaN(targetId)) {
        room.sendAnnouncement("ID no válido. Usa !ban #[id]", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener razón (opcional)
    let reason = "Sin razón especificada";
    if (args.length > 2) {
        reason = message.substring(message.indexOf(args[2]));
    }
    
    // Obtener el jugador objetivo
    let targetPlayer = room.getPlayer(targetId);
    if (!targetPlayer) {
        room.sendAnnouncement("Jugador no encontrado.", player.id, 0xFF0000);
        return false;
    }
    
    // Verificar si el jugador a banear tiene un rol superior
    if (hasPermission(targetPlayer, getRole(player))) {
        room.sendAnnouncement("No puedes banear a un jugador con rol igual o superior al tuyo.", player.id, 0xFF0000);
        return false;
    }
    
    // Guardar la información del ban
    if (!banList.some(ban => ban.id === targetPlayer.id)) {
        banList.push({
            id: targetPlayer.id,
            name: targetPlayer.name,
            auth: authArray[targetPlayer.id] ? authArray[targetPlayer.id][0] : null,
            ip: targetPlayer.conn,
            by: player.name,
            reason: reason,
            date: new Date().toLocaleString()
        });
    }
    
    // Anunciar el ban
    room.sendAnnouncement(`🚫 ${targetPlayer.name} ha sido baneado permanentemente por ${player.name}. Razón: ${reason}`, null, 0xFF0000, "bold");
    
    // Ejecutar el ban (true para indicar que es un ban)
    room.kickPlayer(targetPlayer.id, reason, true);
    
    return false;
}

function kickTeamCommand(player, message) {
    var msgArray = message.split(/ +/);
    var reasonString = `Team kick by ${player.name}`;
    if (msgArray.length > 1) {
        reasonString = msgArray.slice(1).join(' ');
    }
    if (['!kickred', '!kickr'].includes(msgArray[0].toLowerCase())) {
        for (let i = 0; i < teamRed.length; i++) {
            setTimeout(() => {
                room.kickPlayer(teamRed[0].id, reasonString, false);
            }, i * 20)
        }
    } else if (['!kickblue', '!kickb'].includes(msgArray[0].toLowerCase())) {
        for (let i = 0; i < teamBlue.length; i++) {
            setTimeout(() => {
                room.kickPlayer(teamBlue[0].id, reasonString, false);
            }, i * 20)
        }
    } else if (['!kickspec', '!kicks'].includes(msgArray[0].toLowerCase())) {
        for (let i = 0; i < teamSpec.length; i++) {
            setTimeout(() => {
                room.kickPlayer(teamSpec[0].id, reasonString, false);
            }, i * 20)
        }
    }
}


function stadiumCommand(player, message) {
    let stadiumName = message.split(' ')[0].substring(1).toLowerCase();
    let stadiumMap;
    
    if (stadiumName === 'training') {
        stadiumMap = trainingMap;
    } else if (stadiumName === 'classic') {
        stadiumMap = classicMap;
    } else if (stadiumName === 'big') {
        stadiumMap = bigMap;
    } else {
        room.sendAnnouncement("Mapa no reconocido.", player.id, 0xFF0000);
        return false;
    }
    
    // Si es ADMIN_PERM o superior, cambiar mapa instantáneamente
    if (hasPermission(player, Role.ADMIN_PERM)) {
        if (gameState !== State.STOP) {
            room.stopGame();
            room.setCustomStadium(stadiumMap);
            room.startGame();
        } else {
            room.setCustomStadium(stadiumMap);
        }
        room.sendAnnouncement(`🏟️ ${player.name} ha cambiado el mapa a ${stadiumName}.`, null, 0x00FF00, "bold", 2);
        return false;
    }
    
    // Si es ADMIN_TEMP, solo permitir cambio cuando el juego está detenido
    if (hasPermission(player, Role.ADMIN_TEMP) && getRole(player) < Role.ADMIN_PERM) {
        if (gameState === State.STOP) {
            room.setCustomStadium(stadiumMap);
            room.sendAnnouncement(`🏟️ ${player.name} ha cambiado el mapa a ${stadiumName}.`, null, 0x00FF00, "bold", 2);
        } else {
            room.sendAnnouncement("[❌] Solo puedes cambiar el mapa cuando el juego está detenido.", player.id, 0xFF0000, "bold", 2);
        }
        return false;
    }
    
    // Jugadores normales no tienen permiso
    room.sendAnnouncement("[❌] No tienes permiso para cambiar el mapa.", player.id, 0xFF0000, "bold", 2);
    return false;

}

function tempBanCommand(player, message) {
    if (!hasPermission(player, Role.ADMIN_TEMP)) {
        room.sendAnnouncement("No tienes permiso para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    if (args.length < 3) {
        room.sendAnnouncement("Uso: !tempban #[id] [minutos] [razón opcional]", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener el ID del jugador a banear
    let targetId = parseInt(args[1].substring(1));
    if (isNaN(targetId)) {
        room.sendAnnouncement("ID no válido. Usa !tempban #[id] [minutos]", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener la duración en minutos
    let duration = parseInt(args[2]);
    if (isNaN(duration) || duration <= 0) {
        room.sendAnnouncement("Duración no válida. Usa un número positivo de minutos.", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener razón (opcional)
    let reason = "Sin razón especificada";
    if (args.length > 3) {
        reason = message.substring(message.indexOf(args[3]));
    }
    
    // Obtener el jugador objetivo
    let targetPlayer = room.getPlayer(targetId);
    if (!targetPlayer) {
        room.sendAnnouncement("Jugador no encontrado.", player.id, 0xFF0000);
        return false;
    }
    
    // Verificar si el jugador a banear tiene un rol superior
    if (hasPermission(targetPlayer, getRole(player) + 1)) {
        room.sendAnnouncement("No puedes banear a un jugador con rol superior al tuyo.", player.id, 0xFF0000);
        return false;
    }
    
    // Banear al jugador
    room.kickPlayer(targetPlayer.id, reason, true);
    
    // Anunciar el ban temporal
    room.sendAnnouncement(`🚫 ${targetPlayer.name} ha sido baneado por ${duration} minutos. Razón: ${reason}`, null, 0xFF0000);
    
    // Programar el desbaneo
    setTimeout(() => {
        room.clearBan(targetPlayer.id);
        room.sendAnnouncement(`✅ El ban de ${targetPlayer.name} ha expirado.`, null, 0x00FF00);
    }, duration * 60 * 1000);
    
    return false;
}


function kickCommand(player, message) {
    if (!hasPermission(player, Role.ADMIN_TEMP)) {
        room.sendAnnouncement("No tienes permiso para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    if (args.length < 2) {
        room.sendAnnouncement("Uso: !kick #[id] [razón opcional]", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener el ID del jugador a kickear
    let targetId = parseInt(args[1].substring(1));
    if (isNaN(targetId)) {
        room.sendAnnouncement("ID no válido. Usa !kick #[id]", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener razón (opcional)
    let reason = "Sin razón especificada";
    if (args.length > 2) {
        reason = message.substring(message.indexOf(args[2]));
    }
    
    // Obtener el jugador objetivo
    let targetPlayer = room.getPlayer(targetId);
    if (!targetPlayer) {
        room.sendAnnouncement("Jugador no encontrado.", player.id, 0xFF0000);
        return false;
    }
    
    // Verificar si el jugador a kickear tiene un rol superior
    if (hasPermission(targetPlayer, getRole(player) + 1)) {
        room.sendAnnouncement("No puedes kickear a un jugador con rol superior al tuyo.", player.id, 0xFF0000);
        return false;
    }
    
    // Kickear al jugador (false para no ban)
    room.kickPlayer(targetPlayer.id, reason, false);
    
    // Anunciar el kick
    room.sendAnnouncement(`👟 ${targetPlayer.name} ha sido kickeado. Razón: ${reason}`, null, 0xFF9900);
    
    return false;
}

function adminChatCommand(player, message) {
    if (!hasPermission(player, Role.ADMIN_TEMP)) {
        room.sendAnnouncement("No tienes permiso para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    let adminMessage = "";
    
    // Obtener el mensaje después de !ac o ac
    if (message.startsWith("!ac ")) {
        adminMessage = message.substring(4);
    } else if (message.startsWith("ac ")) {
        adminMessage = message.substring(3);
    } else {
        room.sendAnnouncement("Uso: !ac [mensaje] o ac [mensaje]", player.id, 0xFF0000);
        return false;
    }
    
    if (adminMessage.trim() === "") {
        room.sendAnnouncement("El mensaje no puede estar vacío.", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener el rol del emisor para el prefijo
    let roleName = getRoleName(getRole(player));
    
    // Enviar el mensaje solo a los administradores
    let players = room.getPlayerList();
    for (let i = 0; i < players.length; i++) {
        if (hasPermission(players[i], Role.ADMIN_TEMP)) {
            room.sendAnnouncement(`[ADMIN CHAT] ${roleName} ${player.name}: ${adminMessage}`, players[i].id, 0x00CCFF, "bold");
        }
    }
    
    return false;
}

function muteCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerMute = room.getPlayer(parseInt(msgArray[0]));
                var minutesMute = muteDuration;
                if (msgArray.length > 1 && parseInt(msgArray[1]) > 0) {
                    minutesMute = parseInt(msgArray[1]);
                }
                if (!playerMute.admin) {
                    var muteObj = new MutePlayer(playerMute.name, playerMute.id, authArray[playerMute.id][0]);
                    muteObj.setDuration(minutesMute);
                    room.sendAnnouncement(
                        `${playerMute.name} has been muted for ${minutesMute} minutes.`,
                        null,
                        announcementColor,
                        'bold',
                        null
                    );
                } else {
                    room.sendAnnouncement(
                        `You can't mute an admin.`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `There is no player with such ID in the room. Enter "!help mute" for more information.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `Incorrect format for your argument. Enter "!help mute" for more information.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Wrong number of arguments. Enter "!help mute" for more information.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function unmuteCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerUnmute = room.getPlayer(parseInt(msgArray[0]));
                if (muteArray.getByPlayerId(playerUnmute.id) != null) {
                    var muteObj = muteArray.getByPlayerId(playerUnmute.id);
                    muteObj.remove()
                    room.sendAnnouncement(
                        `${playerUnmute.name} has been unmuted !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.sendAnnouncement(
                        `This player isn't muted !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `There is no player with such ID in the room. Enter "!help unmute" for more information.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else if (msgArray[0].length > 0 && parseInt(msgArray[0]) > 0 && muteArray.getById(parseInt(msgArray[0])) != null) {
            var playerUnmute = muteArray.getById(parseInt(msgArray[0]));
            playerUnmute.remove();
            room.sendAnnouncement(
                `${playerUnmute.name} has been unmuted !`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `Incorrect format for your argument. Enter "!help unmute" for more information.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Wrong number of arguments. Enter "!help unmute" for more information.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function muteListCommand(player, message) {
    if (muteArray.list.length == 0) {
        room.sendAnnouncement(
            "🔇 There's nobody in the mute list.",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return false;
    }
    var cstm = '🔇 Mute list : ';
    for (let mute of muteArray.list) {
        cstm += mute.name + `[${mute.id}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        announcementColor,
        'bold',
        null
    );
}

/* MASTER COMMANDS */

function clearbansCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length == 0) {
        room.clearBans();
        room.sendAnnouncement(
            '✔️ Bans cleared !',
            null,
            announcementColor,
            'bold',
            null
        );
        banList = [];
    } else if (msgArray.length == 1) {
        if (parseInt(msgArray[0]) > 0) {
            var ID = parseInt(msgArray[0]);
            room.clearBan(ID);
            if (banList.length != banList.filter((p) => p[1] != ID).length) {
                room.sendAnnouncement(
                    `✔️ ${banList.filter((p) => p[1] == ID)[0][0]} has been unbanned from the room !`,
                    null,
                    announcementColor,
                    'bold',
                    null
                );
            } else {
                room.sendAnnouncement(
                    `The ID you entered doesn't have a ban associated to. Enter "!help clearbans" for more information.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
            banList = banList.filter((p) => p[1] != ID);
        } else {
            room.sendAnnouncement(
                `Invalid ID entered. Enter "!help clearbans" for more information.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Wrong number of arguments. Enter "!help clearbans" for more information.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function banListCommand(player, message) {
    if (!hasPermission(player, Role.ADMIN_TEMP)) {
        room.sendAnnouncement("No tienes permiso para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    if (banList.length === 0) {
        room.sendAnnouncement("No hay jugadores baneados actualmente.", player.id, 0xFF9900);
        return false;
    }
    
    room.sendAnnouncement("Lista de jugadores baneados:", player.id, 0xFF9900);
    
    for (let i = 0; i < banList.length; i++) {
        let ban = banList[i];
        room.sendAnnouncement(`${i+1}. ${ban.name} - ID: ${ban.id} - Auth: ${ban.auth || "No autenticado"} - Por: ${ban.by} - Razón: ${ban.reason} - Fecha: ${ban.date}`, player.id, 0xFF9900);
    }
    
    return false;
}

function unbanCommand(player, message) {
    if (!hasPermission(player, Role.ADMIN_PERM)) {
        room.sendAnnouncement("No tienes permiso para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    if (args.length < 2) {
        room.sendAnnouncement("Uso: !unban [número/id/auth]", player.id, 0xFF0000);
        return false;
    }
    
    let identifier = args[1];
    
    // Buscar por número en la lista
    if (!isNaN(identifier) && identifier > 0 && identifier <= banList.length) {
        let index = parseInt(identifier) - 1;
        let unbannedPlayer = banList[index];
        room.clearBan(unbannedPlayer.id);
        room.sendAnnouncement(`✅ ${unbannedPlayer.name} ha sido desbaneado por ${player.name}.`, null, 0x00FF00);
        banList.splice(index, 1);
        return false;
    }
    
    // Buscar por ID de jugador
    let targetId = parseInt(identifier);
    if (!isNaN(targetId)) {
        let banIndex = banList.findIndex(ban => ban.id === targetId);
        
        if (banIndex !== -1) {
            let unbannedPlayer = banList[banIndex];
            room.clearBan(unbannedPlayer.id);
            room.sendAnnouncement(`✅ ${unbannedPlayer.name} ha sido desbaneado por ${player.name}.`, null, 0x00FF00);
            banList.splice(banIndex, 1);
            return false;
        }
    }
    
    // Buscar por auth
    let authIndex = banList.findIndex(ban => ban.auth === identifier);
    if (authIndex !== -1) {
        let unbannedPlayer = banList[authIndex];
        room.clearBan(unbannedPlayer.id);
        room.sendAnnouncement(`✅ ${unbannedPlayer.name} ha sido desbaneado por ${player.name}.`, null, 0x00FF00);
        banList.splice(authIndex, 1);
        return false;
    }
    
    room.sendAnnouncement("Jugador no encontrado en la lista de baneados.", player.id, 0xFF0000);
    return false;
}

function adminListCommand(player, message) {
    if (adminList.length == 0) {
        room.sendAnnouncement(
            "📢 There's nobody in the admin list.",
            player.id,
            announcementColor,
            'bold',
            null
        );
        return false;
    }
    var cstm = '📢 Admin list : ';
    for (let i = 0; i < adminList.length; i++) {
        cstm += adminList[i][1] + `[${i}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + '.';
    room.sendAnnouncement(
        cstm,
        player.id,
        announcementColor,
        'bold',
        null
    );
}

function setAdminCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

                if (!adminList.map((a) => a[0]).includes(authArray[playerAdmin.id][0])) {
                    if (!masterList.includes(authArray[playerAdmin.id][0])) {
                        room.setPlayerAdmin(playerAdmin.id, true);
                        adminList.push([authArray[playerAdmin.id][0], playerAdmin.name]);
                        room.sendAnnouncement(
                            `${playerAdmin.name} is now a room admin !`,
                            null,
                            announcementColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    } else {
                        room.sendAnnouncement(
                            `This player is a master already !`,
                            player.id,
                            errorColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    }
                } else {
                    room.sendAnnouncement(
                        `This player is a permanent admin already !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `There is no player with such ID in the room. Enter "!help setadmin" for more information.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `Incorrect format for your argument. Enter "!help setadmin" for more information.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Wrong number of arguments. Enter "!help setadmin" for more information.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function removeAdminCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
            msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
            if (room.getPlayer(parseInt(msgArray[0])) != null) {
                var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

                if (adminList.map((a) => a[0]).includes(authArray[playerAdmin.id][0])) {
                    room.setPlayerAdmin(playerAdmin.id, false);
                    adminList = adminList.filter((a) => a[0] != authArray[playerAdmin.id][0]);
                    room.sendAnnouncement(
                        `${playerAdmin.name} is not a room admin anymore !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.sendAnnouncement(
                        `This player isn't a permanent admin !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `There is no player with such ID in the room. Enter "!help removeadmin" for more information.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else if (msgArray[0].length > 0 && parseInt(msgArray[0]) < adminList.length) {
            var index = parseInt(msgArray[0]);
            var playerAdmin = adminList[index];
            if (playersAll.findIndex((p) => authArray[p.id][0] == playerAdmin[0]) != -1) {
                // check if there is the removed admin in the room
                var indexRem = playersAll.findIndex((p) => authArray[p.id][0] == playerAdmin[0]);
                room.setPlayerAdmin(playersAll[indexRem].id, false);
            }
            adminList.splice(index);
            room.sendAnnouncement(
                `${playerAdmin[1]} is not a room admin anymore !`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `Incorrect format for your argument. Enter "!help removeadmin" for more information.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    } else {
        room.sendAnnouncement(
            `Wrong number of arguments. Enter "!help removeadmin" for more information.`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
    }
}

function passwordCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
        if (msgArray.length == 1 && msgArray[0] == '') {
            roomPassword = '';
            room.setPassword(null);
            room.sendAnnouncement(
                `The room password has been removed.`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        }
        roomPassword = msgArray.join(' ');
        room.setPassword(roomPassword);
        room.sendAnnouncement(
            `The room password has been set to ${roomPassword}`,
            player.id,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
    } else {
        if (roomPassword != '') {
            roomPassword = '';
            room.setPassword(null);
            room.sendAnnouncement(
                `The room password has been removed.`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            room.sendAnnouncement(
                `The room currently does not have a password. Enter "!help password" for more information.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }
}

/* GAME FUNCTIONS */

function checkTime() {
    const scores = room.getScores();
    if (game != undefined) game.scores = scores;
    if (Math.abs(scores.time - scores.timeLimit) <= 0.01 && scores.timeLimit != 0 && playSituation == Situation.PLAY) {
        if (scores.red != scores.blue) {
            if (!checkTimeVariable) {
                checkTimeVariable = true;
                setTimeout(() => {
                    checkTimeVariable = false;
                }, 3000);
                scores.red > scores.blue ? endGame(Team.RED) : endGame(Team.BLUE);
                stopTimeout = setTimeout(() => {
                    room.stopGame();
                }, 2000);
            }
            return;
        }
        if (drawTimeLimit != 0) {
            goldenGoal = true;
            room.sendAnnouncement(
                '⚽ First goal wins !',
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }
    if (Math.abs(scores.time - drawTimeLimit * 60 - scores.timeLimit) <= 0.01 && scores.timeLimit != 0) {
        if (!checkTimeVariable) {
            checkTimeVariable = true;
            setTimeout(() => {
                checkTimeVariable = false;
            }, 10);
            endGame(Team.SPECTATORS);
            room.stopGame();
            goldenGoal = false;
        }
    }
}

function instantRestart() {
    room.stopGame();
    startTimeout = setTimeout(() => {
        room.startGame();
    }, 10);
}

function resumeGame() {
    startTimeout = setTimeout(() => {
        room.startGame();
    }, 1000);
    setTimeout(() => {
        room.pauseGame(false);
    }, 500);
}

function endGame(winner) {
    if (players.length >= 2 * teamSize - 1) activateChooseMode();
    const scores = room.getScores();
    game.scores = scores;
    lastWinner = winner;
    endGameVariable = true;
    
    // Asegurarse de que teamRed y teamBlue son strings
    const equipoRojo = typeof teamRed === 'object' ? (teamRed.nombreEquipo || "Equipo Rojo") : teamRed || "Equipo Rojo";
    const equipoAzul = typeof teamBlue === 'object' ? (teamBlue.nombreEquipo || "Equipo Azul") : teamBlue || "Equipo Azul";
    
    // Definir colores más vibrantes y atractivos
    const brightRedColor = 0xFF3333;     // Rojo vibrante
    const brightBlueColor = 0x3333FF;    // Azul vibrante
    const goldColor = 0xFFD700;          // Dorado para destacar
    const whiteColor = 0xFFFFFF;         // Blanco para estadísticas
    
    // Emojis para mejorar los anuncios
    const trophyEmoji = "🏆";
    const fireEmoji = "🔥";
    const starEmoji = "⭐";
    const medalEmoji = "🥇";
    
    // Mensaje de victoria con el nombre del equipo según la camiseta
    if (winner == Team.RED) {
        streak++;
        room.sendAnnouncement(
            `${trophyEmoji} ¡${equipoRojo} GANÓ! ${fireEmoji} ${scores.red} - ${scores.blue} ${fireEmoji}`,
            null,
            brightRedColor,
            "bold"
        );
        room.sendAnnouncement(
            `${starEmoji} Racha actual: ${streak} ${streak >= 3 ? fireEmoji.repeat(Math.min(streak, 5)) : ''}`,
            null,
            brightRedColor,
            "bold"
        );
    } else if (winner == Team.BLUE) {
        streak = 1;
        room.sendAnnouncement(
            `${trophyEmoji} ¡${equipoAzul} GANÓ! ${fireEmoji} ${scores.blue} - ${scores.red} ${fireEmoji}`,
            null,
            brightBlueColor,
            "bold"
        );
        room.sendAnnouncement(
            `${starEmoji} Racha actual: ${streak}`,
            null,
            brightBlueColor,
            "bold"
        );
    } else {
        streak = 0;
        room.sendAnnouncement(
            `${medalEmoji} ¡EMPATE FINAL! ${medalEmoji}`,
            null,
            goldColor,
            "bold"
        );
    }
    
    // Separador visual para mejor organización
    room.sendAnnouncement(
        "━━━━━━━━━ ESTADÍSTICAS DEL PARTIDO ━━━━━━━━━",
        null,
        whiteColor,
        "bold"
    );
    
    // Calcular posesión con emojis más atractivos
    let possessionRedPct = Math.round((possession[0] / (possession[0] + possession[1])) * 100);
    let possessionBluePct = 100 - possessionRedPct;
    
    // Indicador visual de la posesión
    let possessionBar = "";
    const totalBars = 10;
    const redBars = Math.round((possessionRedPct / 100) * totalBars);
    const blueBars = totalBars - redBars;
    possessionBar = "🔴".repeat(redBars) + "🔵".repeat(blueBars);
    
    // Mostrar posesión con barra visual
    room.sendAnnouncement(
        `⚽ POSESIÓN: ${equipoRojo} ${possessionRedPct}% - ${possessionBluePct}% ${equipoAzul}`,
        null,
        whiteColor,
        "bold"
    );
    room.sendAnnouncement(
        `${possessionBar}`,
        null,
        whiteColor
    );
    
    // Calcular zona de acción con visualización mejorada
    let actionRedPct = Math.round((actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1])) * 100);
    let actionBluePct = 100 - actionRedPct;
    
    // Indicador visual de la zona de acción
    let actionBar = "";
    const actionRedBars = Math.round((actionRedPct / 100) * totalBars);
    const actionBlueBars = totalBars - actionRedBars;
    actionBar = "🔴".repeat(actionRedBars) + "🔵".repeat(actionBlueBars);
    
    // Mostrar zona de acción con barra visual
    room.sendAnnouncement(
        `🥅 ZONA DE ACCIÓN: ${equipoRojo} ${actionRedPct}% - ${actionBluePct}% ${equipoAzul}`,
        null,
        whiteColor,
        "bold"
    );
    room.sendAnnouncement(
        `${actionBar}`,
        null,
        whiteColor
    );
    
    // Mostrar Clean Sheet con mensaje personalizado si aplica
    if (scores.red === 0) {
        let gkBlue = getGK(Team.BLUE);
        if (gkBlue) {
            room.sendAnnouncement(
                `🧤 ¡VALLA INVICTA! ${gkBlue.name} de ${equipoAzul} mantuvo su arco en cero`,
                null,
                brightBlueColor,
                "bold"
            );
        }
    } else if (scores.blue === 0) {
        let gkRed = getGK(Team.RED);
        if (gkRed) {
            room.sendAnnouncement(
                `🧤 ¡VALLA INVICTA! ${gkRed.name} de ${equipoRojo} mantuvo su arco en cero`,
                null,
                brightRedColor,
                "bold"
            );
        }
    }
    
    // Separador final
    room.sendAnnouncement(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        null,
        whiteColor
    );
    
    updateStats();
}

/* CHOOSING FUNCTIONS */

function activateChooseMode() {
    chooseMode = true;
    slowMode = chooseModeSlowMode;
    room.sendAnnouncement(
        `🐢 **Modo lento cambiado a modo de elección** | Duración: **${chooseModeSlowMode}s**`,
        null,
        announcementColor,
        'bold',
        HaxNotification.CHAT
    );
}

function deactivateChooseMode() {
    chooseMode = false;
    clearTimeout(timeOutCap);
    if (slowMode != defaultSlowMode) {
        slowMode = defaultSlowMode;
        room.sendAnnouncement(
            `🐢 **Modo lento regresado a normal** | Duración: **${defaultSlowMode}s**`,
            null,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
    }
    redCaptainChoice = '';
    blueCaptainChoice = '';
}
function getSpecList(player) {
    if (player == null) return null;
    
    // Crear cabecera con estilo
    room.sendAnnouncement(
        "━━━━━━━ 📋 JUGADORES DISPONIBLES ━━━━━━━",
        player.id,
        0xFFD700, // Color dorado
        'bold',
        HaxNotification.CHAT
    );
    
    // Mostrar cada jugador con su número
    if (teamSpec.length === 0) {
        room.sendAnnouncement(
            "¡No hay jugadores disponibles para elegir!",
            player.id,
            0xFF4500, // Naranja-rojizo
            'bold',
            HaxNotification.CHAT
        );
    } else {
        for (let i = 0; i < teamSpec.length; i++) {
            room.sendAnnouncement(
                `${i + 1}. ${teamSpec[i].name}`,
                player.id,
                0xFFFFFF, // Blanco
                'normal',
                HaxNotification.CHAT
            );
        }
    }
    
    // Mostrar instrucciones
    room.sendAnnouncement(
        "Escribe el número del jugador, o 'top', 'random', 'bottom'",
        player.id,
        0x00BFFF, // Celeste
        'bold',
        HaxNotification.CHAT
    );
    
    // Línea de cierre
    room.sendAnnouncement(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        player.id,
        0xFFD700, // Color dorado
        'bold',
        HaxNotification.CHAT
    );
}
function choosePlayer() {
    clearTimeout(timeOutCap);
    let captain;
    if (teamRed.length <= teamBlue.length && teamRed.length != 0) {
        captain = teamRed[0];
    } else if (teamBlue.length < teamRed.length && teamBlue.length != 0) {
        captain = teamBlue[0];
    }
    if (captain != null) {
    room.sendAnnouncement(
            "Para elegir un jugador, ingrese su número en la lista dada o use 'top', 'random' o 'bottom'.",
            captain.id,
            infoColor,
            'bold',
            HaxNotification.MENTION
        );
        timeOutCap = setTimeout(
            (player) => {
                room.sendAnnouncement(
                    `Hurry up ${player.name}, only ${Number.parseInt(String(chooseTime / 2))} seconds left to choose !`,
        player.id,
                    warningColor,
                    'bold',
                    HaxNotification.MENTION
                );
                timeOutCap = setTimeout(
                    (player) => {
                        room.kickPlayer(
                            player.id,
                            "You didn't choose in time !",
                            false
                        );
                    },
                    chooseTime * 500,
                    captain
                );
            },
            chooseTime * 1000,
            captain
        );
    }
    if (teamRed.length != 0 && teamBlue.length != 0) {
        getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
    }
}

function chooseModeFunction(player, message) {
    var msgArray = message.split(/ +/);
    if (player.id == teamRed[0].id || player.id == teamBlue[0].id) {
        if (teamRed.length <= teamBlue.length && player.id == teamRed[0].id) {
            if (['top', 'auto'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[0].id, Team.RED);
                redCaptainChoice = 'top';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} chose Top !`,
                    null,
                    announcementColor,
        'bold',
        HaxNotification.CHAT
    );
            } else if (['random', 'rand'].includes(msgArray[0].toLowerCase())) {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.RED);
                redCaptainChoice = 'random';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} chose Random !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['bottom', 'bot'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
                redCaptainChoice = 'bottom';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} chose Bottom !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
                if (Number.parseInt(msgArray[0]) > teamSpec.length || Number.parseInt(msgArray[0]) < 1) {
                    room.sendAnnouncement(
                        `Your number is invalid !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.setPlayerTeam(
                        teamSpec[Number.parseInt(msgArray[0]) - 1].id,
                        Team.RED
                    );
                    room.sendAnnouncement(
                        `${player.name} chose ${teamSpec[Number.parseInt(msgArray[0]) - 1].name} !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else return false;
            return true;
        }
        if (teamRed.length > teamBlue.length && player.id == teamBlue[0].id) {
            if (['top', 'auto'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                blueCaptainChoice = 'top';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} chose Top !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['random', 'rand'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(
                    teamSpec[getRandomInt(teamSpec.length)].id,
                    Team.BLUE
                );
                blueCaptainChoice = 'random';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} chose Random !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (['bottom', 'bot'].includes(msgArray[0].toLowerCase())) {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
                blueCaptainChoice = 'bottom';
                clearTimeout(timeOutCap);
                room.sendAnnouncement(
                    `${player.name} chose Bottom !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
                if (Number.parseInt(msgArray[0]) > teamSpec.length || Number.parseInt(msgArray[0]) < 1) {
                    room.sendAnnouncement(
                        `Your number is invalid !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    room.setPlayerTeam(
                        teamSpec[Number.parseInt(msgArray[0]) - 1].id,
                        Team.BLUE
                    );
                    room.sendAnnouncement(
                        `${player.name} chose ${teamSpec[Number.parseInt(msgArray[0]) - 1].name} !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else return false;
            return true;
        }
    }
}

function checkCaptainLeave(player) {
    if (
        (teamRed.findIndex((red) => red.id == player.id) == 0 && chooseMode && teamRed.length <= teamBlue.length) ||
        (teamBlue.findIndex((blue) => blue.id == player.id) == 0 && chooseMode && teamBlue.length < teamRed.length)
    ) {
        choosePlayer();
        capLeft = true;
        setTimeout(() => {
            capLeft = false;
        }, 10);
    }
}

function slowModeFunction(player, message) {
    if (!player.admin) {
        if (!SMSet.has(player.id)) {
            SMSet.add(player.id);
            setTimeout(
                (number) => {
                    SMSet.delete(number);
                },
                slowMode * 1000,
                player.id
            );
        } else {
            return true;
        }
    }
    return false;
}

/* PLAYER FUNCTIONS */

// Función auxiliar para actualizar las listas de equipos
function updateTeams() {
    const players = room.getPlayerList();
    teamRed = players.filter(p => p.team === Team.RED);
    teamBlue = players.filter(p => p.team === Team.BLUE);
    teamSpec = players.filter(p => p.team === Team.SPECTATORS);
}
function updateAdmins(excludedPlayerID = 0) {
    if (players.length != 0 && players.filter((p) => p.admin).length < maxAdmins) {
        let playerArray = players.filter((p) => p.id != excludedPlayerID && !p.admin);
        let arrayID = playerArray.map((player) => player.id);
        room.setPlayerAdmin(Math.min(...arrayID), true);
    }
}

// Objeto para almacenar roles personalizados por auth
var playerRoles = {};


// Contraseñas para roles (añade esto cerca de tus otras variables globales)
var rolePasswords = {
    [Role.MASTER]: "jubilado123",
    [Role.OWNER]: "lisensiado123",
    [Role.CO_OWNER]: "lisensiado",
    [Role.SUPERADMIN]: "parmegiano",
    [Role.ADMIN_PERM]: "mondongo123"
    // No incluir ADMIN_TEMP ni PLAYER ya que no deberían tener contraseña
};

// Función para el comando !setpassword
function changeRolePasswordCommand(player, message) {
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("No tienes permiso para cambiar contraseñas de roles.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    if (args.length < 3) {
        room.sendAnnouncement("Uso: !setpassword [rol] [nueva_contraseña]", player.id, 0xFF0000);
        room.sendAnnouncement("Roles disponibles: master, owner, coowner, superadmin, admin", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener el rol y la nueva contraseña
    let roleName = args[1].toLowerCase();
    let newPassword = args[2];
    let roleValue;
    
    // Determinar el valor numérico del rol
    switch (roleName) {
        case "master":
            roleValue = Role.MASTER;
            break;
        case "owner":
            roleValue = Role.OWNER;
            break;
        case "coowner":
        case "co-owner":
            roleValue = Role.CO_OWNER;
            break;
        case "superadmin":
            roleValue = Role.SUPERADMIN;
            break;
        case "admin":
            roleValue = Role.ADMIN_PERM;
            break;
        default:
            room.sendAnnouncement("Rol no válido. Usa: master, owner, coowner, superadmin, admin", player.id, 0xFF0000);
            return false;
    }
    
    // Actualizar la contraseña
    rolePasswords[roleValue] = newPassword;
    room.sendAnnouncement(`✅ Contraseña para ${roleName} actualizada a: ${newPassword}`, player.id, 0x00FF00);
    
    return false;
}

function getRole(player) {
    if (!player || !authArray[player.id]) return Role.PLAYER;
    
    // Verificar si es el host
    if (player.id === 0) return Role.OWNER;
    
    // Verificar roles personalizados asignados
    const playerAuth = authArray[player.id][0];
    if (playerAuth && playerRoles[playerAuth]) {
        return playerRoles[playerAuth];
    }
    
    // Sistema de listas
    if (masterList.find(a => a == playerAuth)) {
        return Role.MASTER;
    }
    
    if (ownerList.find(a => a == playerAuth)) {
        return Role.OWNER;
    }
    
    if (coownerList.find(a => a == playerAuth)) {
        return Role.CO_OWNER;
    }
    
    if (adminList.find(a => a[0] == playerAuth)) {
        return Role.ADMIN_PERM;
    }
    
    // Admin temporal del juego
    if (player.admin) {
        return Role.ADMIN_TEMP;
    }
    
    return Role.PLAYER;
}

// Función para obtener el nombre del rol
function getRoleName(roleValue) {
    switch (roleValue) {
        case Role.MASTER:
            return "MASTER";
        case Role.OWNER:
            return "OWNER";
        case Role.CO_OWNER:
            return "CO-OWNER";
        case Role.SUPERADMIN:
            return "SUPERADMIN";
        case Role.ADMIN_PERM:
            return "ADMIN";
        case Role.ADMIN_TEMP:
            return "ADMIN-TEMP";
        default:
            return "PLAYER";
    }
}

function addOwnerCommand(player, message) {
    if (getRole(player) < Role.MASTER) {
        room.sendAnnouncement("No tienes permiso para añadir owners.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    if (args.length < 2) {
        room.sendAnnouncement("Uso: !addowner #[id]", player.id, 0xFF0000);
        return false;
    }
    
    let targetId = parseInt(args[1].substring(1));
    if (isNaN(targetId)) {
        room.sendAnnouncement("ID no válido. Usa !addowner #[id]", player.id, 0xFF0000);
        return false;
    }
    
    let targetPlayer = room.getPlayer(targetId);
    if (!targetPlayer) {
        room.sendAnnouncement("Jugador no encontrado.", player.id, 0xFF0000);
        return false;
    }
    
    if (!authArray[targetPlayer.id]) {
        room.sendAnnouncement("El jugador necesita estar autenticado.", player.id, 0xFF0000);
        return false;
    }
    
    let targetAuth = authArray[targetPlayer.id][0];
    if (!ownerList.includes(targetAuth)) {
        ownerList.push(targetAuth);
        room.sendAnnouncement(`${targetPlayer.name} ha sido añadido a la lista de owners.`, null, 0x00FF00);
    } else {
        room.sendAnnouncement(`${targetPlayer.name} ya está en la lista de owners.`, player.id, 0xFF0000);
    }
    
    return false;
}

function addCoOwnerCommand(player, message) {
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("No tienes permiso para añadir co-owners.", player.id, 0xFF0000);
        return false;
    }
    
    // Código similar al anterior pero para co-owners
    let args = message.split(" ");
    if (args.length < 2) {
        room.sendAnnouncement("Uso: !addcoowner #[id]", player.id, 0xFF0000);
        return false;
    }
    
    let targetId = parseInt(args[1].substring(1));
    if (isNaN(targetId)) {
        room.sendAnnouncement("ID no válido. Usa !addcoowner #[id]", player.id, 0xFF0000);
        return false;
    }
    
    let targetPlayer = room.getPlayer(targetId);
    if (!targetPlayer) {
        room.sendAnnouncement("Jugador no encontrado.", player.id, 0xFF0000);
        return false;
    }
    
    if (!authArray[targetPlayer.id]) {
        room.sendAnnouncement("El jugador necesita estar autenticado.", player.id, 0xFF0000);
        return false;
    }
    
    let targetAuth = authArray[targetPlayer.id][0];
    if (!coownerList.includes(targetAuth)) {
        coownerList.push(targetAuth);
        room.sendAnnouncement(`${targetPlayer.name} ha sido añadido a la lista de co-owners.`, null, 0x00FF00);
    } else {
        room.sendAnnouncement(`${targetPlayer.name} ya está en la lista de co-owners.`, player.id, 0xFF0000);
    }
    
    return false;
}

// También comandos para remover
function removeOwnerCommand(player, message) {
    // Implementación similar
}

function removeCoOwnerCommand(player, message) {
    // Implementación similar
}

// Función para el comando !login
function loginCommand(player, message) {
    if (!authArray[player.id]) {
        room.sendAnnouncement("Necesitas estar autenticado para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    if (args.length < 2) {
        room.sendAnnouncement("Uso: !login [contraseña]", player.id, 0xFF0000);
        return false;
    }
    
    let password = args[1];
    let foundRole = null;
    
    // Buscar el rol que corresponde a esta contraseña
    for (let roleKey in rolePasswords) {
        if (rolePasswords[roleKey] === password) {
            foundRole = parseInt(roleKey);
            break;
        }
    }
    
    if (foundRole !== null) {
        // Verificar si el rol encontrado es inferior al que ya tiene
        let currentRole = getRole(player);
        if (foundRole <= currentRole) {
            room.sendAnnouncement(`Ya tienes un rol igual o superior a ${getRoleName(foundRole)}.`, player.id, 0xFFFF00);
            return false;
        }
        
        // Asignar el nuevo rol
        const playerAuth = authArray[player.id][0];
        playerRoles[playerAuth] = foundRole;
        
        // Otorgar admin si es necesario
        if (foundRole >= Role.ADMIN_TEMP && !player.admin) {
            room.setPlayerAdmin(player.id, true);
        }
        
        room.sendAnnouncement(`✅ Te has autenticado como ${getRoleName(foundRole)}.`, player.id, 0x00FF00);
    } else {
        room.sendAnnouncement("❌ Contraseña incorrecta.", player.id, 0xFF0000);
    }
    
    return false;
}

// Función para el comando !changepass
function changePasswordCommand(player, message) {
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("No tienes permiso para cambiar contraseñas de roles.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    if (args.length < 3) {
        room.sendAnnouncement("Uso: !changepass [rol] [nueva_contraseña]", player.id, 0xFF0000);
        room.sendAnnouncement("Roles disponibles: master, owner, coowner, superadmin, admin", player.id, 0xFF0000);
        return false;
    }
    
    // Obtener el rol y la nueva contraseña
    let roleName = args[1].toLowerCase();
    let newPassword = args[2];
    let roleValue;
    
    // Determinar el valor numérico del rol
    switch (roleName) {
        case "master":
            roleValue = Role.MASTER;
            break;
        case "owner":
            roleValue = Role.OWNER;
            break;
        case "coowner":
        case "co-owner":
            roleValue = Role.CO_OWNER;
            break;
        case "superadmin":
            roleValue = Role.SUPERADMIN;
            break;
        case "admin":
            roleValue = Role.ADMIN_PERM;
            break;
        default:
            room.sendAnnouncement("Rol no válido. Usa: master, owner, coowner, superadmin, admin", player.id, 0xFF0000);
            return false;
    }
    
    // Actualizar la contraseña
    rolePasswords[roleValue] = newPassword;
    room.sendAnnouncement(`✅ Contraseña para ${roleName} actualizada a: ${newPassword}`, player.id, 0x00FF00);
    
    return false;
}

// Función para el comando !showpasswords
function showRolePasswordsCommand(player) {
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("No tienes permiso para ver las contraseñas de roles.", player.id, 0xFF0000);
        return false;
    }
    
    room.sendAnnouncement("Contraseñas actuales para cada rol:", player.id, 0xFFFF00);
    
    for (let roleKey in rolePasswords) {
        let roleName = getRoleName(parseInt(roleKey));
        room.sendAnnouncement(`${roleName}: ${rolePasswords[roleKey]}`, player.id, 0xFFFF00);
    }
    
    return false;
}

// Función para el comando !passwords
function showPasswordsCommand(player) {
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("No tienes permiso para ver las contraseñas de roles.", player.id, 0xFF0000);
        return false;
    }
    
    room.sendAnnouncement("Contraseñas actuales para cada rol:", player.id, 0xFFFF00);
    
    for (let roleKey in rolePasswords) {
        let roleName = getRoleName(parseInt(roleKey));
        room.sendAnnouncement(`${roleName}: ${rolePasswords[roleKey]}`, player.id, 0xFFFF00);
    }
    
    return false;
}

function roleCommand(player, message) {
    // Verificar si quien usa el comando tiene permiso
    if (getRole(player) < Role.OWNER) {
        room.sendAnnouncement("No tienes permiso para usar este comando.", player.id, 0xFF0000);
        return false;
    }
    
    let args = message.split(" ");
    if (args.length < 3) {
        room.sendAnnouncement("Uso: !role [nombreJugador] [master/owner/coowner/superadmin/admin/player]", player.id, 0xFFFFFF);
        return false;
    }
    
    let targetName = args[1];
    let targetPlayer = room.getPlayerList().find(p => p.name.includes(targetName));
    
    if (!targetPlayer) {
        room.sendAnnouncement(`Jugador "${targetName}" no encontrado.`, player.id, 0xFF0000);
        return false;
    }
    
    if (!authArray[targetPlayer.id]) {
        room.sendAnnouncement("El jugador necesita estar autenticado para asignarle un rol.", player.id, 0xFF0000);
        return false;
    }
    
    let roleName = args[2].toLowerCase();
    let roleValue;
    
    switch (roleName) {
        case "master":
            roleValue = Role.MASTER;
            break;
        case "owner":
            roleValue = Role.OWNER;
            break;
        case "coowner":
        case "co-owner":
            roleValue = Role.CO_OWNER;
            break;
        case "superadmin":
            roleValue = Role.SUPERADMIN;
            break;
        case "admin":
            roleValue = Role.ADMIN_PERM;
            break;
        case "player":
            roleValue = Role.PLAYER;
            break;
        default:
            room.sendAnnouncement("Rol no válido. Usa: master, owner, coowner, superadmin, admin o player", player.id, 0xFF0000);
            return false;
    }
    
    const targetAuth = authArray[targetPlayer.id][0];
    playerRoles[targetAuth] = roleValue;
    
    room.sendAnnouncement(`Se ha asignado el rol ${roleName} a ${targetPlayer.name}.`, null, 0x00FF00);
    
    // Si es admin o superior, darle admin en el juego
    if (roleValue >= Role.ADMIN_TEMP && !targetPlayer.admin) {
        room.setPlayerAdmin(targetPlayer.id, true);
    } else if (roleValue < Role.ADMIN_TEMP && targetPlayer.admin) {
        room.setPlayerAdmin(targetPlayer.id, false);
    }
    
    return false;
}

// Función auxiliar para verificar permisos
function hasPermission(player, requiredRole) {
    return getRole(player) >= requiredRole;
}

function ghostKickHandle(oldP, newP) {
    var teamArrayId = getTeamArray(oldP.team, true).map((p) => p.id);
    teamArrayId.splice(teamArrayId.findIndex((id) => id == oldP.id), 1, newP.id);

    room.kickPlayer(oldP.id, 'Ghost kick', false);
    room.setPlayerTeam(newP.id, oldP.team);
    room.setPlayerAdmin(newP.id, oldP.admin);
    room.reorderPlayers(teamArrayId, true);

    if (oldP.team != Team.SPECTATORS && playSituation != Situation.STOP) {
        var discProp = room.getPlayerDiscProperties(oldP.id);
        room.setPlayerDiscProperties(newP.id, discProp);
    }
}

/* ACTIVITY FUNCTIONS */

function handleActivityPlayer(player) {
    let pComp = getPlayerComp(player);
    if (pComp != null) {
        pComp.inactivityTicks++;
        if (pComp.inactivityTicks == 60 * ((2 / 3) * afkLimit)) {
        room.sendAnnouncement(
                `⛔ ${player.name}, Si no te mueves o escribes en ${Math.floor(afkLimit / 3)} segundos, serás kickeado!`,
            player.id,
                warningColor,
                'bold',
                HaxNotification.MENTION
            );
            return;
        }
        if (pComp.inactivityTicks >= 60 * afkLimit) {
            pComp.inactivityTicks = 0;
            if (game.scores.time <= afkLimit - 0.5) {
                setTimeout(() => {
                    !chooseMode ? instantRestart() : room.stopGame();
                }, 10);
            }
            room.kickPlayer(player.id, 'AFK', false);
        }
    }
}

function handleActivityPlayerTeamChange(changedPlayer) {
    if (changedPlayer.team == Team.SPECTATORS) {
        let pComp = getPlayerComp(changedPlayer);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
}

function handleActivityStop() {
    for (let player of players) {
        let pComp = getPlayerComp(player);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
}

function handleActivity() {
    if (gameState === State.PLAY && players.length > 1) {
        for (let player of teamRed) {
            handleActivityPlayer(player);
        }
        for (let player of teamBlue) {
            handleActivityPlayer(player);
        }
    }
}

/* LINEUP FUNCTIONS */

function getStartingLineups() {
    var compositions = [[], []];
    for (let player of teamRed) {
        compositions[0].push(
            new PlayerComposition(player, authArray[player.id][0], [0], [])
        );
    }
    for (let player of teamBlue) {
        compositions[1].push(
            new PlayerComposition(player, authArray[player.id][0], [0], [])
        );
    }
    return compositions;
}

// Función para manejar cambios en la alineación
function handleLineupChangeTeamChange(player, team, oldTeam) {
    // 1. Verificar que teamRed y teamBlue sean arrays válidos
    if (!Array.isArray(teamRed)) {
        teamRed = room.getPlayerList().filter(p => p.team === Team.RED);
        console.log("teamRed no era un array, corregido");
    }
    
    if (!Array.isArray(teamBlue)) {
        teamBlue = room.getPlayerList().filter(p => p.team === Team.BLUE);
        console.log("teamBlue no era un array, corregido");
    }
    
    // 2. Contar jugadores en cada equipo
    const redCount = teamRed.length;
    const blueCount = teamBlue.length;
    const totalPlayers = redCount + blueCount;
    
    console.log(`Jugadores: Rojo ${redCount}, Azul ${blueCount}, Total ${totalPlayers}`);
    
    // 3. Cambiar el mapa según el número de jugadores
    if (totalPlayers <= 4) {
        // 1v1 o 2v2: usar mapa small
        if (currentStadium !== "small") {
            room.setDefaultStadium("small");
            currentStadium = "small";
            room.sendAnnouncement(
                "🏟️ Mapa cambiado a SMALL para 2v2.",
                null,
                0x00BFFF,
                "bold",
                HaxNotification.CHAT
            );
        }
    } else if (totalPlayers <= 6) {
        // 3v3: usar mapa medium
        if (currentStadium !== "medium") {
            room.setDefaultStadium("medium");
            currentStadium = "medium";
            room.sendAnnouncement(
                "🏟️ Mapa cambiado a MEDIUM para 3v3.",
                null,
                0x00BFFF,
                "bold",
                HaxNotification.CHAT
            );
        }
    } else {
        // 4v4 o más: usar mapa big
        if (currentStadium !== "big") {
            room.setDefaultStadium("big");
            currentStadium = "big";
            room.sendAnnouncement(
                "🏟️ Mapa cambiado a BIG para 4v4+.",
                null,
                0x00BFFF,
                "bold",
                HaxNotification.CHAT
            );
        }
    }
    
    // 4. Inicializar variable global si no existe
    if (typeof currentStadium === 'undefined') {
        currentStadium = "medium"; // Valor por defecto
    }
    
    // 5. Reiniciar el partido si es necesario
    if (autoRestart && team !== oldTeam) {
        // Solo reiniciamos si hay un cambio real de equipo y no es el primer ingreso
        if (oldTeam !== Team.SPECTATORS || team !== Team.SPECTATORS) {
            room.stopGame();
            setTimeout(() => {
                room.startGame();
            }, 500);
        }
    }
}

function handleLineupChangeLeave(player) {
    if (playSituation != Situation.STOP) {
        if (player.team == Team.RED) {
            // player gets in red team
            var redLineupAuth = game.playerComp[0].map((p) => p.auth);
            var ind = redLineupAuth.findIndex((auth) => auth == authArray[player.id][0]);
            var playerLineup = game.playerComp[0][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[0].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        } else if (player.team == Team.BLUE) {
            // player gets in blue team
            var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
            var ind = blueLineupAuth.findIndex((auth) => auth == authArray[player.id][0]);
            var playerLineup = game.playerComp[1][ind];
            if (playerLineup.timeEntry.includes(game.scores.time)) {
                // gets subbed off then in at the exact same time -> no sub
                if (game.scores.time == 0) {
                    game.playerComp[1].splice(ind, 1);
                } else {
                    playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                }
            } else {
                playerLineup.timeExit.push(game.scores.time);
            }
        }
    }
}

/* TEAM BALANCE FUNCTIONS */

function balanceTeams() {
    if (!chooseMode) {
        if (players.length == 0) {
            room.stopGame();
            room.setScoreLimit(scoreLimit);
            room.setTimeLimit(timeLimit);
        } else if (players.length == 1 && teamRed.length == 0) {
            instantRestart();
            setTimeout(() => {
                stadiumCommand(emptyPlayer, `!training`);
            }, 5);
            room.setPlayerTeam(players[0].id, Team.RED);
        } else if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length && teamSpec.length > 0) {
            const n = Math.abs(teamRed.length - teamBlue.length);
            if (players.length == 2) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!classic`);
                }, 5);
            }
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(teamSpec[i].id, Team.BLUE);
                }
            } else {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(teamSpec[i].id, Team.RED);
                }
            }
        } else if (Math.abs(teamRed.length - teamBlue.length) > teamSpec.length) {
            const n = Math.abs(teamRed.length - teamBlue.length);
            if (players.length == 1) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!training`);
                }, 5);
                room.setPlayerTeam(players[0].id, Team.RED);
                return;
            } else if (teamSize > 2 && players.length == 5) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!classic`);
                }, 5);
            }
            if (players.length == teamSize * 2 - 1) {
                teamRedStats = [];
                teamBlueStats = [];
            }
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(
                        teamRed[teamRed.length - 1 - i].id,
                        Team.SPECTATORS
                    );
                }
            } else {
                for (var i = 0; i < n; i++) {
                    room.setPlayerTeam(
                        teamBlue[teamBlue.length - 1 - i].id,
                        Team.SPECTATORS
                    );
                }
            }
        } else if (Math.abs(teamRed.length - teamBlue.length) < teamSpec.length && teamRed.length != teamBlue.length) {
            room.pauseGame(true);
            activateChooseMode();
            choosePlayer();
        } else if (teamSpec.length >= 2 && teamRed.length == teamBlue.length && teamRed.length < teamSize) {
            if (teamRed.length == 2) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!big`);
                }, 5);
            }
            topButton();
        }
    }
}

function handlePlayersJoin() {
    if (chooseMode) {
        if (teamSize > 2 && players.length == 6) {
            setTimeout(() => {
                stadiumCommand(emptyPlayer, `!big`);
            }, 5);
        }
        getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
    }
    balanceTeams();
}

function handlePlayersLeave() {
    if (gameState != State.STOP) {
        var scores = room.getScores();
        if (players.length >= 2 * teamSize && scores.time >= (5 / 6) * game.scores.timeLimit && teamRed.length != teamBlue.length) {
            var rageQuitCheck = false;
            if (teamRed.length < teamBlue.length) {
                if (scores.blue - scores.red == 2) {
                    endGame(Team.BLUE);
                    rageQuitCheck = true;
                }
            } else {
                if (scores.red - scores.blue == 2) {
                    endGame(Team.RED);
                    rageQuitCheck = true;
                }
            }
            if (rageQuitCheck) {
                room.sendAnnouncement(
                    "Ragequit detected, game ended.",
                    null,
                    infoColor,
                    'bold',
                    HaxNotification.MENTION
                )
                stopTimeout = setTimeout(() => {
                    room.stopGame();
                }, 100);
                return;
            }
        }
    }
    if (chooseMode) {
        if (teamSize > 2 && players.length == 5) {
            setTimeout(() => {
                stadiumCommand(emptyPlayer, `!classic`);
            }, 5);
        }
        if (teamRed.length == 0 || teamBlue.length == 0) {
            room.setPlayerTeam(teamSpec[0].id, teamRed.length == 0 ? Team.RED : Team.BLUE);
            return;
        }
        if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
            deactivateChooseMode();
            resumeGame();
            var b = teamSpec.length;
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            } else {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.RED);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            }
            return;
        }
        if (streak == 0 && gameState == State.STOP) {
            if (Math.abs(teamRed.length - teamBlue.length) == 2) {
                var teamIn = teamRed.length > teamBlue.length ? teamRed : teamBlue;
                room.setPlayerTeam(teamIn[teamIn.length - 1].id, Team.SPECTATORS)
            }
        }
        if (teamRed.length == teamBlue.length && teamSpec.length < 2) {
            deactivateChooseMode();
            resumeGame();
            return;
        }

        if (capLeft) {
            choosePlayer();
        } else {
            getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
        }
    }
    balanceTeams();
}

function handlePlayersTeamChange(byPlayer) {
    if (chooseMode && !removingPlayers && byPlayer == null) {
        if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
            deactivateChooseMode();
            resumeGame();
            var b = teamSpec.length;
            if (teamRed.length > teamBlue.length) {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            } else {
                for (var i = 0; i < b; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        room.setPlayerTeam(teamSpec[0].id, Team.RED);
                    }, 5 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 5 * b);
            }
            return;
        } else if (
            (teamRed.length == teamSize && teamBlue.length == teamSize) ||
            (teamRed.length == teamBlue.length && teamSpec.length < 2)
        ) {
            deactivateChooseMode();
            resumeGame();
        } else if (teamRed.length <= teamBlue.length && redCaptainChoice != '') {
            if (redCaptainChoice == 'top') {
                room.setPlayerTeam(teamSpec[0].id, Team.RED);
            } else if (redCaptainChoice == 'random') {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.RED);
            } else {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
            }
            return;
        } else if (teamBlue.length < teamRed.length && blueCaptainChoice != '') {
            if (blueCaptainChoice == 'top') {
                room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
            } else if (blueCaptainChoice == 'random') {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.BLUE);
            } else {
                room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
            }
            return;
        } else {
            choosePlayer();
        }
    }
}

function handlePlayersStop(byPlayer) {
    if (byPlayer == null && endGameVariable) {
        if (chooseMode) {
            if (players.length == 2 * teamSize) {
                chooseMode = false;
                resetButton();
                for (var i = 0; i < teamSize; i++) {
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        randomButton();
                    }, 200 * i);
                }
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 200 * teamSize);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else {
                if (lastWinner == Team.RED) {
                    blueToSpecButton();
                } else if (lastWinner == Team.BLUE) {
                    redToSpecButton();
                    setTimeout(() => {
                        swapButton();
                    }, 10);
                } else {
                    resetButton();
                }
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                setTimeout(() => {
                    topButton();
                }, 300);
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 300);
            }
        } else {
            if (players.length == 2) {
                if (lastWinner == Team.BLUE) {
                    swapButton();
                }
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 3 || players.length >= 2 * teamSize + 1) {
                if (lastWinner == Team.RED) {
                    blueToSpecButton();
                } else {
                    redToSpecButton();
                    setTimeout(() => {
                        swapButton();
                    }, 5);
                }
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                setTimeout(() => {
                    topButton();
                }, 200);
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 300);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 4) {
                resetButton();
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                setTimeout(() => {
                    randomButton();
                    setTimeout(() => {
                        randomButton();
                    }, 500);
                }, 500);
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 2000);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 5 || players.length >= 2 * teamSize + 1) {
                if (lastWinner == Team.RED) {
                    blueToSpecButton();
                } else {
                    redToSpecButton();
                    setTimeout(() => {
                        swapButton();
                    }, 5);
                }
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 200);
                setTimeout(() => {
                    topButton();
                }, 200);
                activateChooseMode();
            } else if (players.length == 6) {
                resetButton();
                clearTimeout(insertingTimeout);
                insertingPlayers = true;
                insertingTimeout = setTimeout(() => {
                    insertingPlayers = false;
                }, 1500);
                setTimeout(() => {
                    randomButton();
                    setTimeout(() => {
                        randomButton();
                        setTimeout(() => {
                            randomButton();
                        }, 500);
                    }, 500);
                }, 500);
                startTimeout = setTimeout(() => {
                    room.startGame();
                }, 2000);
            }
        }
    }
}

/* STATS FUNCTIONS */

/* GK FUNCTIONS */

function handleGKTeam(team) {
    if (team == Team.SPECTATORS) {
        return null;
    }
    let teamArray = team == Team.RED ? teamRed : teamBlue;
    let playerGK = teamArray.reduce((prev, current) => {
        if (team == Team.RED) {
            return (prev?.position.x < current.position.x) ? prev : current
        } else {
            return (prev?.position.x > current.position.x) ? prev : current
        }
    }, null);
    let playerCompGK = getPlayerComp(playerGK);
    return playerCompGK;
}

function handleGK() {
    let redGK = handleGKTeam(Team.RED);
    if (redGK != null) {
        redGK.GKTicks++;
    }
    let blueGK = handleGKTeam(Team.BLUE);
    if (blueGK != null) {
        blueGK.GKTicks++;
    }
}

function getGK(team) {
    if (team == Team.SPECTATORS) {
        return null;
    }
    let teamArray = team == Team.RED ? game.playerComp[0] : game.playerComp[1];
    let playerGK = teamArray.reduce((prev, current) => {
        return (prev?.GKTicks > current.GKTicks) ? prev : current
    }, null);
    return playerGK;
}

function getCS(scores) {
    let playersNameCS = [];
    let redGK = getGK(Team.RED);
    let blueGK = getGK(Team.BLUE);
    if (redGK != null && scores.blue == 0) {
        playersNameCS.push(redGK.player.name);
    }
    if (blueGK != null && scores.red == 0) {
        playersNameCS.push(blueGK.player.name);
    }
    return playersNameCS;
}

function getCSString(scores) {
    let playersCS = getCS(scores);
    if (playersCS.length == 0) {
        return "🥅 No CS";
    } else if (playersCS.length == 1) {
        return `🥅 ${playersCS[0]} had a CS.`;
    } else {
        return `🥅 ${playersCS[0]} and ${playersCS[1]} had a CS.`;
    }
}

/* GLOBAL STATS FUNCTIONS */

function getLastTouchOfTheBall() {
    const ballPosition = room.getBallPosition();
    updateTeams();
    let playerArray = [];
    for (let player of players) {
        if (player.position != null) {
            var distanceToBall = pointDistance(player.position, ballPosition);
            if (distanceToBall < triggerDistance) {
                if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY;
                playerArray.push([player, distanceToBall]);
            }
        }
    }
    if (playerArray.length != 0) {
        let playerTouch = playerArray.sort((a, b) => a[1] - b[1])[0][0];
        if (lastTeamTouched == playerTouch.team || lastTeamTouched == Team.SPECTATORS) {
            if (lastTouches[0] == null || (lastTouches[0] != null && lastTouches[0].player.id != playerTouch.id)) {
                game.touchArray.push(
                    new BallTouch(
                        playerTouch,
                        game.scores.time,
                        getGoalGame(),
                        ballPosition
                    )
                );
                lastTouches[0] = checkGoalKickTouch(
                    game.touchArray,
                    game.touchArray.length - 1,
                    getGoalGame()
                );
                lastTouches[1] = checkGoalKickTouch(
                    game.touchArray,
                    game.touchArray.length - 2,
                    getGoalGame()
                );
            }
        }
        lastTeamTouched = playerTouch.team;
    }
}

function getBallSpeed() {
    var ballProp = room.getDiscProperties(0);
    return Math.sqrt(ballProp.xspeed ** 2 + ballProp.yspeed ** 2) * speedCoefficient;
}

function getGameStats() {
    if (playSituation == Situation.PLAY && gameState == State.PLAY) {
        lastTeamTouched == Team.RED ? possession[0]++ : possession[1]++;
        var ballPosition = room.getBallPosition();
        ballPosition.x < 0 ? actionZoneHalf[0]++ : actionZoneHalf[1]++;
        handleGK();
    }
}

/* GOAL ATTRIBUTION FUNCTIONS */

function getGoalAttribution(team) {
    var goalAttribution = Array(2).fill(null);
    if (lastTouches[0] != null) {
        if (lastTouches[0].player.team == team) {
            // Direct goal scored by player
            if (lastTouches[1] != null && lastTouches[1].player.team == team) {
                goalAttribution = [lastTouches[0].player, lastTouches[1].player];
            } else {
                goalAttribution = [lastTouches[0].player, null];
            }
        } else {
            // Own goal
            goalAttribution = [lastTouches[0].player, null];
        }
    }
    return goalAttribution;
}

function getGoalString(team) {
    var goalString;
    var scores = game.scores;
    var goalAttribution = getGoalAttribution(team);
    
    // Definir colores y nombres de equipos en español
    var teamColor = team == Team.RED ? 0xE56E56 : 0x5689E5;
    var teamName = team == Team.RED ? "EQUIPO ROJO" : "EQUIPO AZUL";
    var teamEmoji = team == Team.RED ? "🔴" : "🔵";
    
    if (goalAttribution[0] != null) {
        if (goalAttribution[0].team == team) {
            // Gol normal
            if (goalAttribution[1] != null && goalAttribution[1].team == team) {
                // Con asistencia
                goalString = `${teamEmoji} ¡¡GOOOOOL!! ${teamEmoji}\n⚽ ${getTimeGame(scores.time)} | ${goalAttribution[0].name} anota para el ${teamName}\n👟 Asistencia: ${goalAttribution[1].name}\n🚀 Velocidad: ${ballSpeed.toFixed(2)}km/h`;
                game.goals.push(
                    new Goal(
                        scores.time,
                        team,
                        goalAttribution[0],
                        goalAttribution[1]
                    )
                );
            } else {
                // Sin asistencia
                goalString = `${teamEmoji} ¡¡GOOOOOL!! ${teamEmoji}\n⚽ ${getTimeGame(scores.time)} | ${goalAttribution[0].name} anota para el ${teamName}\n🚀 Velocidad: ${ballSpeed.toFixed(2)}km/h`;
                game.goals.push(
                    new Goal(scores.time, team, goalAttribution[0], null)
                );
            }
        } else {
            // Autogol
            goalString = `🤦‍♂️ ¡¡AUTOGOL!! 🤦‍♂️\n😱 ${getTimeGame(scores.time)} | ${goalAttribution[0].name} anota en su propia portería\n⚽ Punto para el ${teamName}\n🚀 Velocidad: ${ballSpeed.toFixed(2)}km/h`;
            game.goals.push(
                new Goal(scores.time, team, goalAttribution[0], null)
            );
        }
    } else {
        // Gol sin atribución clara
        goalString = `${teamEmoji} ¡¡GOOOOOL!! ${teamEmoji}\n⚽ ${getTimeGame(scores.time)} | Anotación para el ${teamName}\n🚀 Velocidad: ${ballSpeed.toFixed(2)}km/h`;
        game.goals.push(
            new Goal(scores.time, team, null, null)
        );
    }

    return goalString;
}
/* ROOM STATS FUNCTIONS */

function updatePlayerStats(player, teamStats) {
    var stats = new HaxStatistics(player.name);
    var pComp = getPlayerComp(player);
    if (localStorage.getItem(authArray[player.id][0])) {
        stats = JSON.parse(localStorage.getItem(authArray[player.id][0]));
    }
    stats.games++;
    if (lastWinner == teamStats) stats.wins++;
    stats.winrate = ((100 * stats.wins) / (stats.games || 1)).toFixed(1) + `%`;
    stats.goals += getGoalsPlayer(pComp);
    stats.assists += getAssistsPlayer(pComp);
    stats.ownGoals += getOwnGoalsPlayer(pComp);
    stats.CS += getCSPlayer(pComp);
    stats.playtime += getGametimePlayer(pComp);
    localStorage.setItem(authArray[player.id][0], JSON.stringify(stats));
}


function printRankings(statKey, id = 0) {
    var leaderboard = [];
    statKey = statKey == "cs" ? "CS" : statKey;
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.length == 43)
            leaderboard.push([
                JSON.parse(localStorage.getItem(key)).playerName,
                JSON.parse(localStorage.getItem(key))[statKey],
            ]);
    }
    if (leaderboard.length < 5) {
        if (id != 0) {
            room.sendAnnouncement(
                'Not enough games played yet !',
                id,
                errorColor,
            'bold',
            HaxNotification.CHAT
        );
        }
        return;
    }
    leaderboard.sort(function (a, b) { return b[1] - a[1]; });
    var rankingString = `${statKey.charAt(0).toUpperCase() + statKey.slice(1)}> `;
    for (let i = 0; i < 5; i++) {
        let playerName = leaderboard[i][0];
        let playerStat = leaderboard[i][1];
        if (statKey == 'playtime') playerStat = getTimeStats(playerStat);
        rankingString += `#${i + 1} ${playerName} : ${playerStat}, `;
    }
    rankingString = rankingString.substring(0, rankingString.length - 2);
    room.sendAnnouncement(
        rankingString,
        id,
        infoColor,
        'bold',
        HaxNotification.CHAT
    );
}

/* GET STATS FUNCTIONS */


function getGamePlayerStats(player) {
    var stats = new HaxStatistics(player.name);
    var pComp = getPlayerComp(player);
    stats.goals += getGoalsPlayer(pComp);
    stats.assists += getAssistsPlayer(pComp);
    stats.ownGoals += getOwnGoalsPlayer(pComp);
    stats.playtime += getGametimePlayer(pComp);
    stats.CS += getCSPlayer(pComp);
    return stats;
}

function getGametimePlayer(pComp) {
    if (pComp == null) return 0;
    var timePlayer = 0;
    for (let j = 0; j < pComp.timeEntry.length; j++) {
        if (pComp.timeExit.length < j + 1) {
            timePlayer += game.scores.time - pComp.timeEntry[j];
    } else {
            timePlayer += pComp.timeExit[j] - pComp.timeEntry[j];
        }
    }
    return Math.floor(timePlayer);
}

function getGoalsPlayer(pComp) {
    if (pComp == null) return 0;
    var goalPlayer = 0;
    for (let goal of game.goals) {
        if (goal.striker != null && goal.team === pComp.player.team) {
            if (authArray[goal.striker.id][0] == pComp.auth) {
                goalPlayer++;
            }
        }
    }
    return goalPlayer;
}

function getOwnGoalsPlayer(pComp) {
    if (pComp == null) return 0;
    var goalPlayer = 0;
    for (let goal of game.goals) {
        if (goal.striker != null && goal.team !== pComp.player.team) {
            if (authArray[goal.striker.id][0] == pComp.auth) {
                goalPlayer++;
            }
        }
    }
    return goalPlayer;
}

function getAssistsPlayer(pComp) {
    if (pComp == null) return 0;
    var assistPlayer = 0;
    for (let goal of game.goals) {
        if (goal.assist != null) {
            if (authArray[goal.assist.id][0] == pComp.auth) {
                assistPlayer++;
            }
        }
    }
    return assistPlayer;
}

function getGKPlayer(pComp) {
    if (pComp == null) return 0;
    let GKRed = getGK(Team.RED);
    if (pComp.auth == GKRed?.auth) {
        return Team.RED;
    }
    let GKBlue = getGK(Team.BLUE);
    if (pComp.auth == GKBlue?.auth) {
        return Team.BLUE;
    }
    return Team.SPECTATORS;
}

function getCSPlayer(pComp) {
    if (pComp == null || game.scores == null) return 0;
    if (getGKPlayer(pComp) == Team.RED && game.scores.blue == 0) {
        return 1;
    } else if (getGKPlayer(pComp) == Team.BLUE && game.scores.red == 0) {
        return 1;
    }
    return 0;
}

function actionReportCountTeam(goals, team) {
    let playerActionSummaryTeam = [];
    let indexTeam = team == Team.RED ? 0 : 1;
    let indexOtherTeam = team == Team.RED ? 1 : 0;
    for (let goal of goals[indexTeam]) {
        if (goal[0] != null) {
            if (playerActionSummaryTeam.find(a => a[0].id == goal[0].id)) {
                let index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[0].id);
                playerActionSummaryTeam[index][1]++;
            } else {
                playerActionSummaryTeam.push([goal[0], 1, 0, 0]);
            }
            if (goal[1] != null) {
                if (playerActionSummaryTeam.find(a => a[0].id == goal[1].id)) {
                    let index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[1].id);
                    playerActionSummaryTeam[index][2]++;
                } else {
                    playerActionSummaryTeam.push([goal[1], 0, 1, 0]);
                }
            }
        }
    }
    if (goals[indexOtherTeam].length == 0) {
        let playerCS = getGK(team)?.player;
        if (playerCS != null) {
            if (playerActionSummaryTeam.find(a => a[0].id == playerCS.id)) {
                let index = playerActionSummaryTeam.findIndex(a => a[0].id == playerCS.id);
                playerActionSummaryTeam[index][3]++;
            } else {
                playerActionSummaryTeam.push([playerCS, 0, 0, 1]);
            }
        }
    }

    playerActionSummaryTeam.sort((a, b) => (a[1] + a[2] + a[3]) - (b[1] + b[2] + b[3]));
    return playerActionSummaryTeam;
}

/* PRINT FUNCTIONS */

function printPlayerStats(stats) {
    let statsString = '';
    for (let [key, value] of Object.entries(stats)) {
        if (key == 'playerName') statsString += `${value}: `;
        else {
            if (key == 'playtime') value = getTimeStats(value);
            let reCamelCase = /([A-Z](?=[a-z]+)|[A-Z]+(?![a-z]))/g;
            let statName = key.replaceAll(reCamelCase, ' $1').trim();
            statsString += `${statName.charAt(0).toUpperCase() + statName.slice(1)}: ${value}, `;
        }
    }
    statsString = statsString.substring(0, statsString.length - 2);
    return statsString;
}

/* FETCH FUNCTIONS */

function fetchGametimeReport(game) {
    var fieldGametimeRed = {
        name: '🔴        **RED TEAM STATS**',
        value: '⌛ __**Game Time:**__\n\n',
        inline: true,
    };
    var fieldGametimeBlue = {
        name: '🔵       **BLUE TEAM STATS**',
        value: '⌛ __**Game Time:**__\n\n',
        inline: true,
    };
    var redTeamTimes = game.playerComp[0].map((p) => [p.player, getGametimePlayer(p)]);
    var blueTeamTimes = game.playerComp[1].map((p) => [p.player, getGametimePlayer(p)]);

    for (let time of redTeamTimes) {
        var minutes = getMinutesReport(time[1]);
        var seconds = getSecondsReport(time[1]);
        fieldGametimeRed.value += `> **${time[0].name}:** ${minutes > 0 ? `${minutes}m` : ''}` +
            `${seconds > 0 || minutes == 0 ? `${seconds}s` : ''}\n`;
    }
    fieldGametimeRed.value += `\n${blueTeamTimes.length - redTeamTimes.length > 0 ? '\n'.repeat(blueTeamTimes.length - redTeamTimes.length) : ''
        }`;
    fieldGametimeRed.value += '=====================';

    for (let time of blueTeamTimes) {
        var minutes = getMinutesReport(time[1]);
        var seconds = getSecondsReport(time[1]);
        fieldGametimeBlue.value += `> **${time[0].name}:** ${minutes > 0 ? `${minutes}m` : ''}` +
            `${seconds > 0 || minutes == 0 ? `${seconds}s` : ''}\n`;
    }
    fieldGametimeBlue.value += `\n${redTeamTimes.length - blueTeamTimes.length > 0 ? '\n'.repeat(redTeamTimes.length - blueTeamTimes.length) : ''
        }`;
    fieldGametimeBlue.value += '=====================';

    return [fieldGametimeRed, fieldGametimeBlue];
}

function fetchActionsSummaryReport(game) {
    var fieldReportRed = {
        name: '🔴        **RED TEAM STATS**',
        value: '📊 __**Player Stats:**__\n\n',
        inline: true,
    };
    var fieldReportBlue = {
        name: '🔵       **BLUE TEAM STATS**',
        value: '📊 __**Player Stats:**__\n\n',
        inline: true,
    };
    var goals = [[], []];
    for (let i = 0; i < game.goals.length; i++) {
        goals[game.goals[i].team - 1].push([game.goals[i].striker, game.goals[i].assist]);
    }
    var redActions = actionReportCountTeam(goals, Team.RED);
    if (redActions.length > 0) {
        for (let act of redActions) {
            fieldReportRed.value += `> **${act[0].team != Team.RED ? '[OG] ' : ''}${act[0].name}:**` +
                `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
                `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
                `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`;
        }
    }
    var blueActions = actionReportCountTeam(goals, Team.BLUE);
    if (blueActions.length > 0) {
        for (let act of blueActions) {
            fieldReportBlue.value += `> **${act[0].team != Team.BLUE ? '[OG] ' : ''}${act[0].name}:**` +
                `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
                `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
                `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`;
        }
    }

    fieldReportRed.value += `\n${blueActions.length - redActions.length > 0 ? '\n'.repeat(blueActions.length - redActions.length) : ''
        }`;
    fieldReportRed.value += '=====================';

    fieldReportBlue.value += `\n${redActions.length - blueActions.length > 0 ? '\n'.repeat(redActions.length - blueActions.length) : ''
        }`;
    fieldReportBlue.value += '=====================';

    return [fieldReportRed, fieldReportBlue];
}

function fetchSummaryEmbed(game) {
    var fetchEndgame = [fetchGametimeReport, fetchActionsSummaryReport];
    var logChannel = gameWebhook;
    var fields = [
        {
            name: '🔴        **RED TEAM STATS**',
            value: '=====================\n\n',
            inline: true,
        },
        {
            name: '🔵       **BLUE TEAM STATS**',
            value: '=====================\n\n',
            inline: true,
        },
    ];
    for (let i = 0; i < fetchEndgame.length; i++) {
        var fieldsReport = fetchEndgame[i](game);
        fields[0].value += fieldsReport[0].value + '\n\n';
        fields[1].value += fieldsReport[1].value + '\n\n';
    }
    fields[0].value = fields[0].value.substring(0, fields[0].value.length - 2);
    fields[1].value = fields[1].value.substring(0, fields[1].value.length - 2);

    var possR = possession[0] / (possession[0] + possession[1]);
    var possB = 1 - possR;
    var possRString = (possR * 100).toFixed(0).toString();
    var possBString = (possB * 100).toFixed(0).toString();
    var zoneR = actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1]);
    var zoneB = 1 - zoneR;
    var zoneRString = (zoneR * 100).toFixed(0).toString();
    var zoneBString = (zoneB * 100).toFixed(0).toString();
    var win = (game.scores.red > game.scores.blue) * 1 + (game.scores.blue > game.scores.red) * 2;
    var objectBodyWebhook = {
        embeds: [
            {
                title: `📝 MATCH REPORT #${getIdReport()}`,
                description:
                    `**${getTimeEmbed(game.scores.time)}** ` +
                    (win == 1 ? '**Red Team** ' : 'Red Team ') + game.scores.red +
                    ' - ' +
                    game.scores.blue + (win == 2 ? ' **Blue Team**' : ' Blue Team') +
                    '\n```c\nPossession: ' + possRString + '% - ' + possBString + '%' +
                    '\nAction Zone: ' + zoneRString + '% - ' + zoneBString + '%\n```\n\n',
                color: 9567999,
                fields: fields,
                footer: {
                    text: `Recording: ${getRecordingName(game)}`,
                },
                timestamp: new Date().toISOString(),
            },
        ],
        username: roomName
    };
    if (logChannel != '') {
        fetch(logChannel, {
            method: 'POST',
            body: JSON.stringify(objectBodyWebhook),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
}

/* EVENTS */

/* PLAYER MOVEMENT */

room.onPlayerJoin = function (player) {
    if (room.getScores() != null) {
        updateGK(); // Actualizar porteros si el juego está en curso
    }
    authArray[player.id] = [player.auth, player.conn];
    if (roomWebhook != '') {
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: `[${getDate()}] ➡️ JOIN (${playersAll.length + 1}/${maxPlayers})\n**` +
                    `${player.name}** [${authArray[player.id][0]}] {${authArray[player.id][1]}}`,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
            room.sendAnnouncement(
        `👋 Welcome ${player.name} !\nEnter "t" before your message to use team chat and "@@" followed by a player name to PM him !`,
                player.id,
        welcomeColor,
        'bold',
                HaxNotification.CHAT
            );
    updateTeams();
    updateAdmins();
    if (masterList.findIndex((auth) => auth == player.auth) != -1) {
        room.sendAnnouncement(
            `Master ${player.name} has connected to the room !`,
            null,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
        room.setPlayerAdmin(player.id, true);
    } else if (adminList.map((a) => a[0]).findIndex((auth) => auth == player.auth) != -1) {
        room.sendAnnouncement(
            `Admin ${player.name} has connected to the room !`,
            null,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
        room.setPlayerAdmin(player.id, true);
    }
    var sameAuthCheck = playersAll.filter((p) => p.id != player.id && authArray[p.id][0] == player.auth);
    if (sameAuthCheck.length > 0 && !debugMode) {
        var oldPlayerArray = playersAll.filter((p) => p.id != player.id && authArray[p.id][0] == player.auth);
        for (let oldPlayer of oldPlayerArray) {
            ghostKickHandle(oldPlayer, player);
        }
    }
    handlePlayersJoin();
};
// Función onPlayerTeamChange mejorada
// Función onPlayerTeamChange mejorada
room.onPlayerTeamChange = function(player, team, oldTeam) {
    // Actualizar las listas de jugadores
    updateTeams();
    
    // Ahora que las listas están actualizadas, manejar cambios de alineación
    try {
        handleLineupChangeTeamChange(player, team, oldTeam);
    } catch (error) {
        console.error("Error al manejar cambio de equipo:", error);
        // Intento de recuperación
        try {
            // Método alternativo por si hay errores
            const redCount = room.getPlayerList().filter(p => p.team === Team.RED).length;
            const blueCount = room.getPlayerList().filter(p => p.team === Team.BLUE).length;
            const totalPlayers = redCount + blueCount;
            
            // Lógica simplificada
            if (totalPlayers <= 4) {
                room.setDefaultStadium("small");
            } else if (totalPlayers <= 6) {
                room.setDefaultStadium("medium");
            } else {
                room.setDefaultStadium("big");
            }
        } catch (e) {
            console.error("Error en recuperación:", e);
        }
    }
    
    // Actualizar avatares/camisetas
    if (typeof updatePlayerAvatar === 'function') {
        updatePlayerAvatar(player);
    }
};


room.onPlayerLeave = function (player) {
    setTimeout(() => {
        if (!kickFetchVariable) {
            if (roomWebhook != '') {
                var stringContent = `[${getDate()}] ⬅️ LEAVE (${playersAll.length}/${maxPlayers})\n**${player.name}**` +
                    `[${authArray[player.id][0]}] {${authArray[player.id][1]}}`;
                fetch(roomWebhook, {
                    method: 'POST',
                    body: JSON.stringify({
                        content: stringContent,
                        username: roomName,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((res) => res);
            }
        } else kickFetchVariable = false;
    }, 10);
    handleLineupChangeLeave(player);
    checkCaptainLeave(player);
    updateTeams();
    updateAdmins();
    handlePlayersLeave();
    if (room.getScores() != null) {
        updateGK(); // Actualizar porteros si el juego está en curso
    }    
    // Limpiar intervalos de avatar si el jugador tenía alguno activo
        if (avatarIntervals[player.id]) {
            clearInterval(avatarIntervals[player.id]);
            delete avatarIntervals[player.id];
        }
};

room.onPlayerKicked = function (kickedPlayer, reason, ban, byPlayer) {
    kickFetchVariable = true;
    if (roomWebhook != '') {
        var stringContent = `[${getDate()}] ⛔ ${ban ? 'BAN' : 'KICK'} (${playersAll.length}/${maxPlayers})\n` +
            `**${kickedPlayer.name}** [${authArray[kickedPlayer.id][0]}] {${authArray[kickedPlayer.id][1]}} was ${ban ? 'banned' : 'kicked'}` +
            `${byPlayer != null ? ' by **' + byPlayer.name + '** [' + authArray[byPlayer.id][0] + '] {' + authArray[byPlayer.id][1] + '}' : ''}`
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: stringContent,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
    if ((ban && ((byPlayer != null &&
        (byPlayer.id == kickedPlayer.id || getRole(byPlayer) < Role.MASTER)) || getRole(kickedPlayer) == Role.MASTER)) || disableBans
    ) {
        room.clearBan(kickedPlayer.id);
        return;
    }
    if (byPlayer != null && getRole(byPlayer) < Role.ADMIN_PERM) {
        room.sendAnnouncement(
            'You are not allowed to kick/ban players !',
            byPlayer.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        room.setPlayerAdmin(byPlayer.id, false);
        return;
    }
    if (ban) banList.push([kickedPlayer.name, kickedPlayer.id]);
};

/* PLAYER ACTIVITY */

room.onPlayerChat = function (player, message) {
    let msgArray = message.split(/ +/);

    console.log(`Chat: ${player.name}: ${message}`);
    if (message.startsWith("!")) {
        console.log("Comando detectado:", message);
        const command = message.substring(1).split(" ")[0].toLowerCase();
        console.log("Buscando comando:", command);
    }
    // Si el jugador está AFK y escribe algo, quitarle el estado AFK
    if (isAFK(player) && !message.startsWith("!afk")) {
        // Solo quitar el AFK si el mensaje no es el comando !afk
        removeAFK(player);
        room.sendChat(`👋 ${player.name} ha vuelto de su estado AFK.`);
    }

// En tu función room.onPlayerChat, añade esta comprobación
if (message.startsWith("vip ")) {
    return vipChatCommand(player, message);
}

    // En tu función room.onPlayerChat, añade esta comprobación antes de los otros condicionales
if (message.startsWith("ac ")) {
    return adminChatCommand(player, message);
}
    // Código existente para comandos y otras funcionalidades
    if (message.startsWith('!')) {
        // Manejar comandos, incluye aquí el comando de roles
        if (message.startsWith('!role')) {
            return roleCommand(player, message);
        }
    }

    // Verificar si es un mensaje normal sin comando
    if (!message.startsWith('!')) {
        // Verificar si es una clave de camiseta válida
        var clave = message.trim();
        
        if (camisetasEquipos[clave]) {
            console.log("Clave de camiseta detectada:", clave);
            asignarCamisetaPorClave(clave);
            return false; // Evitar que el mensaje se muestre en el chat
        }
    }

    if (gameState !== State.STOP && player.team != Team.SPECTATORS) {
        let pComp = getPlayerComp(player);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
    
    if (!hideClaimMessage || msgArray[0] != '!claim') {
        if (roomWebhook != '')
            fetch(roomWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    content: `[${getDate()}] 💬 CHAT\n**${player.name}** : ${message.replace('@', '@ ')}`,
                    username: roomName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);
    }

    // Comando para solicitar pausa
    if (message.toLowerCase() === "p") {
        // Si ya hay una pausa activa, ignorar
        if (pausaActiva) {
            room.sendAnnouncement(`[❌] Ya hay una pausa activa en este momento.`, player.id, 0xFF0000, "bold", 2);
            return false;
        }

        // Si no hay una solicitud de pausa pendiente, crear una nueva
        if (!pausaSolicitada) {
            pausaSolicitada = true;
            jugadorSolicitante = player.id;
            room.sendAnnouncement(`⏸️ ${player.name} ha solicitado una pausa. Otro jugador debe confirmar escribiendo "p".`, null, 0xFFFF00, "bold", 2);
            return false;
        } 
        // Si hay una solicitud pendiente y este es otro jugador, confirmar la pausa
        else if (player.id !== jugadorSolicitante) {
            // Establecer pausa activa para evitar solicitudes múltiples
            pausaActiva = true;
            
            // Enviar mensaje de confirmación
            room.sendAnnouncement(`✅ ${player.name} ha confirmado la pausa. El juego se detendrá por 20 segundos.`, null, 0x00FF00, "bold", 2);
            
            // Pausar el juego
            room.pauseGame(true);
            
            // Programar la reanudación del juego después de 20 segundos
            setTimeout(() => {
                // Enviar aviso 5 segundos antes de reanudar
                room.sendAnnouncement("⚠️ El partido se reanudará en 5 segundos.", null, 0xFFFF00, "bold", 2);
                
                // Programar la reanudación final
                setTimeout(() => {
                    room.sendAnnouncement("▶️ La pausa ha terminado. ¡El partido se reanuda!", null, 0x00FF00, "bold", 2);
                    room.pauseGame(false);
                    
                    // Reiniciar variables de pausa
                    pausaSolicitada = false;
                    jugadorSolicitante = null;
                    pausaActiva = false;
                }, 5000);
            }, 15000); // 15 + 5 = 20 segundos en total
            
            return false;
        } 
        // Si el mismo jugador intenta confirmar su propia pausa
        else {
            room.sendAnnouncement(`[❌] No puedes confirmar tu propia solicitud de pausa. Otro jugador debe confirmarla.`, player.id, 0xFF0000, "bold", 2);
            return false;
        }
    }

    // Comando para reiniciar partido
    if (message === "!rr") {
        return handleReinicioComando(player);
    }

    // Comando para ciclo de avatares
    if (message.startsWith('!avatar ')) {
        let currentTime = Date.now();

        // Verificar si el jugador está en cooldown
        if (playerAvatarCooldowns[player.id] && currentTime - playerAvatarCooldowns[player.id] < AVATAR_COOLDOWN) {
            room.sendAnnouncement("⏳ Espera un momento antes de usar este comando nuevamente.", player.id, 0xFF0000, "bold", 7);
            return false; // Bloquea el comando mientras esté en cooldown
        }

        let avatars = message.substring(8).split(',');
        if (avatars.length < 2) {
            room.sendAnnouncement('Debes ingresar al menos dos avatares separados por comas.', player.id, 0xFF0000, 'normal', 1);
            return false;
        }

        // Detener ciclo si ya existía
        if (avatarIntervals[player.id]) {
            clearInterval(avatarIntervals[player.id]);
        }

        let index = 0;
        avatarIntervals[player.id] = setInterval(() => {
            room.setPlayerAvatar(player.id, avatars[index]);
            index = (index + 1) % avatars.length; // Ciclar avatares
        }, 1000); // Cambiar avatar cada 1 segundo

        room.sendAnnouncement(`¡Ciclo de avatares iniciado! Usa !avatarstop para detenerlo.`, player.id, 0x00FF00, 'normal', 1);
        
        // Enviar anuncio global
        room.sendAnnouncement(`${player.name} ha utilizado el comando !avatar ${message.substring(8)}`, null, 0xFFFFFF, 'bold', 1);
        
        // Registrar el tiempo del último uso del comando
        playerAvatarCooldowns[player.id] = currentTime;

        return false;
    }

    // Comando para detener el ciclo de avatares
    if (message === '!avatarstop') {
        if (avatarIntervals[player.id]) {
            clearInterval(avatarIntervals[player.id]);
            delete avatarIntervals[player.id];
            room.setPlayerAvatar(player.id, null); // Restablecer avatar original
            room.sendAnnouncement(`Ciclo de avatares detenido.`, player.id, 0xFFFF00, 'normal', 1);
        } else {
            room.sendAnnouncement(`No tienes un ciclo de avatares activo.`, player.id, 0xFF0000, 'normal', 1);
        }
        return false;
    }

    if (msgArray[0][0] == '!') {
        let command = getCommand(msgArray[0].slice(1).toLowerCase());
        if (command != false && commands[command].roles <= getRole(player)) commands[command].function(player, message);
        else
            room.sendAnnouncement(
                `The command you tried to enter does not exist for you. Please enter '!help' to get the available commands to you.`,
        player.id,
                errorColor,
        'bold',
        HaxNotification.CHAT
    );
        return false;
    }
    
    if (msgArray[0].toLowerCase() == 't') {
        teamChat(player, message);
        return false;
    }
    
       // PARTE 3: MENSAJES PRIVADOS (comienzan con @@)
       if (message.startsWith("@@")) {
        return playerChat(player, message);
    }
    
    if (chooseMode && teamRed.length * teamBlue.length != 0) {
        var choosingMessageCheck = chooseModeFunction(player, message);
        if (choosingMessageCheck) return false;
    }
    
    if (slowMode > 0) {
        var filter = slowModeFunction(player, message);
        if (filter) return false;
    }
    
    if (!player.admin && muteArray.getByAuth(authArray[player.id][0]) != null) {
        room.sendAnnouncement(
            `You are muted !`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return false;
    }
      // PARTE 7: MANEJO DE CAMISETAS
      const formatoCamiseta = /^([a-z]+)([1-3])$/i;
      const matchCamiseta = message.match(formatoCamiseta);
      
      if (matchCamiseta) {
          const equipo = matchCamiseta[1].toLowerCase(); // riv
          const numero = matchCamiseta[2]; // 1, 2 o 3
          
          // Solo permitir si el jugador está en un equipo
          if (player.team === Team.SPECTATORS) {
              room.sendAnnouncement(
                  "❌ Tenés que estar en un equipo para cambiar la camiseta.",
                  player.id,
                  errorColor,
                  'bold',
                  HaxNotification.CHAT
              );
              return false;
          }
          
          // Mapear números a tipos de camiseta
          const tipos = {
              '1': 'titular',
              '2': 'suplente',
              '3': 'tercera'
          };
          
          // Construir la clave según el equipo del jugador
          const teamSuffix = player.team === Team.RED ? "/red" : "/blue";
          const camisetaId = `${equipo}/${tipos[numero]}${teamSuffix}`;
          
          console.log("Intentando aplicar camiseta:", camisetaId);
          
          // Intentar asignar la camiseta
          if (asignarCamisetaPorClave(camisetaId)) {
              room.sendAnnouncement(
                  `🎽 ${player.name} cambió la camiseta a ${equipo.toUpperCase()} ${tipos[numero]}`,
                  null,
                  0x00CC00,
                  "bold",
                  HaxNotification.CHAT
              );
          } else {
              // Si no existe, buscar camisetas disponibles para ese equipo
              const camisetasDisponibles = Object.keys(camisetasEquipos)
                  .filter(k => k.startsWith(equipo + "/"))
                  .map(k => {
                      const partes = k.split('/');
                      return partes[1]; // titular, suplente, tercera
                  })
                  .filter((v, i, a) => a.indexOf(v) === i); // eliminar duplicados
              
              if (camisetasDisponibles.length > 0) {
                  room.sendAnnouncement(
                      `❌ Camiseta no encontrada. Opciones para ${equipo}: ${camisetasDisponibles.map((t, i) => `${equipo}${i+1} (${t})`).join(', ')}`,
                      player.id,
                      errorColor,
                      'bold',
                      HaxNotification.CHAT
                  );
              } else {
                  room.sendAnnouncement(
                      `❌ No hay camisetas disponibles para ${equipo}`,
                      player.id,
                      errorColor,
                      'bold',
                      HaxNotification.CHAT
                  );
              }
          }
          return false;
      }
  

    // AÑADIR ESTA LLAMADA AL FINAL para formatear mensajes según el rol:
    return formatRoleChatMessage(player, message);
};
room.onPositionsReset = function() {
    updateGK(); // Actualizar porteros
};

room.onPlayerActivity = function (player) {
    if (gameState !== State.STOP) {
        let pComp = getPlayerComp(player);
        if (pComp != null) pComp.inactivityTicks = 0;
    }
};

room.onPlayerBallKick = function (player) {
    if (playSituation != Situation.GOAL) {
        var ballPosition = room.getBallPosition();
        if (game.touchArray.length == 0 || player.id != game.touchArray[game.touchArray.length - 1].player.id) {
            if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY;
            lastTeamTouched = player.team;
            game.touchArray.push(
                new BallTouch(
                    player,
                    game.scores.time,
                    getGoalGame(),
                    ballPosition
                )
            );
            lastTouches[0] = checkGoalKickTouch(
                game.touchArray,
                game.touchArray.length - 1,
                getGoalGame()
            );
            lastTouches[1] = checkGoalKickTouch(
                game.touchArray,
                game.touchArray.length - 2,
                getGoalGame()
            );
        }
    }
};

/* GAME MANAGEMENT */

room.onGameStart = function (byPlayer) {
    updateGK();
    clearTimeout(startTimeout);
    if (byPlayer != null) clearTimeout(stopTimeout);
    game = new Game();
    possession = [0, 0];
    actionZoneHalf = [0, 0];
    gameState = State.PLAY;
    endGameVariable = false;
    goldenGoal = false;
    playSituation = Situation.KICKOFF;
    lastTouches = Array(2).fill(null);
    lastTeamTouched = Team.SPECTATORS;
    teamRedStats = [];
    teamBlueStats = [];
    if (teamRed.length == teamSize && teamBlue.length == teamSize) {
        for (var i = 0; i < teamSize; i++) {
            teamRedStats.push(teamRed[i]);
            teamBlueStats.push(teamBlue[i]);
        }
    }
    calculateStadiumVariables();
       
    // Aplicar camisetas según corresponda
    if (currentRedKit === 0 && currentBlueKit === 0) {
        // Si no se han seleccionado camisetas específicas, aplicar partido aleatorio
        aplicarCamisetasAleatorias();
        console.log("✅ Aplicadas camisetas aleatorias al inicio del juego");
    } else {
        // Si se han seleccionado camisetas específicas, usarlas
        try {
            setKit(Team.RED, currentRedKit);
            setKit(Team.BLUE, currentBlueKit);
            console.log("✅ Aplicadas camisetas específicas guardadas");
        } catch (error) {
            console.error("❌ Error al aplicar camisetas guardadas:", error);
            aplicarCamisetasAleatorias();
        }
    }
    
    console.log("Nombres de equipos finales:", teamRedName, teamBlueName);
    
    // Anunciar los equipos después de aplicar las camisetas (solo una vez)
    setTimeout(() => {
        anunciarEquipos();
    }, 500);
};

room.onGameStop = function (byPlayer) {
    // Reiniciar variables de pausa
    pausaSolicitada = false;
    jugadorSolicitante = null;
    pausaActiva = false;
    
    // Reiniciar variables de reinicio
    reinicioSolicitado = false;
    jugadorSolicitanteReinicio = null;
    equipoSolicitanteReinicio = null;
    confirmacionesReinicio = [];
    clearTimeout(stopTimeout);
    clearTimeout(unpauseTimeout);
    
    // Verificar si estamos en modo automático de partidos
    if (autoAssignEnabled) {  // Usar autoAssignEnabled en lugar de autoStart
        // Obtener lista de jugadores
        const players = room.getPlayerList();
        
        // Contar jugadores por equipo y espectadores
        let redCount = 0;
        let blueCount = 0;
        let specCount = 0;
        let allPlayers = [];
        
        for (let player of players) {
            if (player.team === Team.RED) {
                redCount++;
                allPlayers.push(player);
            } else if (player.team === Team.BLUE) {
                blueCount++;
                allPlayers.push(player);
            } else if (player.team === Team.SPECTATORS) {
                specCount++;
            }
        }
        
        // Verificar si es 1v1, 2v2 o 3v3 exacto (sin espectadores)
        if (redCount === blueCount && redCount > 0 && redCount <= 3 && specCount === 0) {
            // Es un partido con equipos iguales y sin espectadores
            // Mezclar aleatoriamente a los jugadores
            shuffleTeams();
            
            // Iniciar un nuevo partido después de un breve delay
            setTimeout(() => {
                room.startGame();
            }, 2000);
        } else if (specCount > 0) {
            // Hay espectadores, informar que están disponibles para jugar
            room.sendAnnouncement(
                "👀 ¡Hay espectadores disponibles para jugar! Use comandos para organizarlos.",
                null,
                0xFFCC00,
                'bold',
                HaxNotification.CHAT
            );
            
            // Continúa con tu proceso normal cuando hay espectadores
        } else {
            // Otros casos (equipos desiguales, etc.)
            // Iniciar nuevo partido con los mismos equipos
            setTimeout(() => {
                room.startGame();
            }, 2000);
        }
    }
    
    if (byPlayer != null) clearTimeout(startTimeout);
    game.rec = room.stopRecording();
    if (
        !cancelGameVariable && game.playerComp[0].length + game.playerComp[1].length > 0 &&
        (
            (game.scores.timeLimit != 0 &&
                ((game.scores.time >= 0.5 * game.scores.timeLimit &&
                    game.scores.time < 0.75 * game.scores.timeLimit &&
                    game.scores.red != game.scores.blue) ||
                    game.scores.time >= 0.75 * game.scores.timeLimit)
            ) ||
            endGameVariable
        )
    ) {
        fetchSummaryEmbed(game);
        if (fetchRecordingVariable) {
            setTimeout((gameEnd) => { fetchRecording(gameEnd); }, 500, game);
        }
    }
    cancelGameVariable = false;
    gameState = State.STOP;
    playSituation = Situation.STOP;
    updateTeams();
    handlePlayersStop(byPlayer);
    handleActivityStop();
};
room.onGamePause = function (byPlayer) {
    if (mentionPlayersUnpause && gameState == State.PAUSE) {
        if (byPlayer != null) {
            room.sendAnnouncement(
                `Game paused by ${byPlayer.name} !`,
                null,
                defaultColor,
                'bold',
                HaxNotification.NONE
            );
        } else {
            room.sendAnnouncement(
                `Game paused !`,
                null,
                defaultColor,
                'bold',
                HaxNotification.NONE
            );
        }
    }
    clearTimeout(unpauseTimeout);
    gameState = State.PAUSE;
};

room.onGameUnpause = function (byPlayer) {
    unpauseTimeout = setTimeout(() => {
        gameState = State.PLAY;
    }, 2000);
    if (mentionPlayersUnpause) {
        if (byPlayer != null) {
            room.sendAnnouncement(
                `Game unpaused by ${byPlayer.name} !`,
                null,
                defaultColor,
                'bold',
                HaxNotification.NONE
            );
        } else {
            room.sendAnnouncement(
                `Game unpaused !`,
                null,
                defaultColor,
                'bold',
                HaxNotification.NONE
            );
        }
    }
    if (
        (teamRed.length == teamSize && teamBlue.length == teamSize && chooseMode) ||
        (teamRed.length == teamBlue.length && teamSpec.length < 2 && chooseMode)
    ) {
        deactivateChooseMode();
    }
};
room.onTeamGoal = function (team) {
    const scores = room.getScores();
    game.scores = scores;
    playSituation = Situation.GOAL;
    ballSpeed = getBallSpeed();
    
    // Actualizar estadísticas
    for (let player of teamRed) {
        var playerComp = getPlayerComp(player);
        team == Team.RED ? playerComp.goalsScoredTeam++ : playerComp.goalsConcededTeam++;
    }
    for (let player of teamBlue) {
        var playerComp = getPlayerComp(player);
        team == Team.BLUE ? playerComp.goalsScoredTeam++ : playerComp.goalsConcededTeam++;
    }
    
    // Obtener el tiempo del gol
    let goalTime = secondsToMinutes(Math.floor(scores.time));
    
    // Variables para el mensaje de gol
    let goalType;
    let scorer = "";
    let assister = "";
    let goalMessage = "";
    
    // Nombres de los equipos
    const teamRedName = "Equipo Rojo";
    const teamBlueName = "Equipo Azul";
    
    // Obtener atribución del gol
    const goalAttribution = getGoalAttribution(team);
    const lastPlayer = goalAttribution[0];
    const secondLastPlayer = goalAttribution[1];
    
    // Configurar variables para las funciones de mensajes
    if (lastPlayer) {
        game.lastKickerName = lastPlayer.name || "Jugador";
        game.lastKickerId = lastPlayer.id;
        game.lastKickerTeam = lastPlayer.team;
    } else {
        game.lastKickerName = "Jugador";
    }
    
    if (secondLastPlayer) {
        game.secondLastKickerName = secondLastPlayer.name || "Jugador";
        game.secondLastKickerId = secondLastPlayer.id;
        game.secondLastKickerTeam = secondLastPlayer.team;
    } else {
        game.secondLastKickerName = "Jugador";
    }
    
    // Definir colores brillantes para los mensajes
    const brightRedColor = 0xFF5555;   // Rojo brillante
    const brightBlueColor = 0x55AAFF;  // Azul brillante
    const ownGoalColor = 0xFFCC00;     // Amarillo para autogoles
    const assistColor = 0x66FF66;      // Verde para asistencias
    const unknownGoalColor = 0xFFFFFF; // Blanco para goles sin atribución
    
    let messageColor;
    
    if (lastPlayer != null) {
        if (lastPlayer.team == team) {
            // Gol normal
            goalType = "⚡ ¡GOLAZO!";
            scorer = getRandomScorerMessage();
            messageColor = team == Team.RED ? brightRedColor : brightBlueColor;
            
            // Celebración
            avatarCelebration(lastPlayer.id, getRandomGoalEmoji());
            
            // Verificar asistencia
            if (secondLastPlayer != null && secondLastPlayer.team == team && lastPlayer.id != secondLastPlayer.id) {
                const assistMessages = [
                    "👟 ¡Gran pase de " + game.secondLastKickerName + "!",
                    "🎯 ¡Preciso pase de " + game.secondLastKickerName + "!",
                    "🔑 ¡La jugada se gestó con una asistencia de " + game.secondLastKickerName + "!",
                    "🤝 ¡" + game.secondLastKickerName + " brinda la asistencia para el gol!"
                ];
                assister = " (" + assistMessages[Math.floor(Math.random() * assistMessages.length)] + ")";
                avatarCelebration(secondLastPlayer.id, "👟");
                
                game.goals.push(new Goal(scores.time, team, lastPlayer, secondLastPlayer));
            } else {
                game.goals.push(new Goal(scores.time, team, lastPlayer, null));
            }
        } else {
            // Autogol
            goalType = "❌ ¡AUTOGOL!";
            scorer = getRandomOwnGoalScorerMessage();
            messageColor = ownGoalColor;
            
            // Celebración para autogol
            avatarCelebration(lastPlayer.id, getRandomAutoGoalEmoji());
            
            game.goals.push(new Goal(scores.time, team, lastPlayer, null));
        }
    } else {
        // Gol sin atribución clara
        goalType = "⚽ ¡GOOOOOOL!";
        scorer = `⚽ Anotación para el equipo ${team == Team.RED ? 'rojo' : 'azul'}`;
        messageColor = unknownGoalColor;
        game.goals.push(new Goal(scores.time, team, null, null));
    }
    
    // Actualizar marcador con emojis
    const redScore = replaceNumbers(scores.red);
    const blueScore = replaceNumbers(scores.blue);
    
    // Construir mensaje de gol
    goalMessage = `${goalType}\n${teamRedName} ${redScore} 🆚 ${blueScore} ${teamBlueName}   ⏱️ ${goalTime}\n\n${scorer}${assister}\n🚀 Velocidad: ${ballSpeed.toFixed(2)} km/h`;
    
    // Enviar anuncio con colores mejorados
    room.sendAnnouncement(
        goalMessage,
        null,
        messageColor,
        'bold',
        HaxNotification.CHAT
    );
    
    // Webhook
    if (roomWebhook != '') {
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: `[${getDate()}] ${goalMessage}`,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
    
    // Verificar fin de juego
    if ((scores.scoreLimit != 0 && (scores.red == scores.scoreLimit || scores.blue == scores.scoreLimit)) || goldenGoal) {
        endGame(team);
        goldenGoal = false;
        stopTimeout = setTimeout(() => {
            room.stopGame();
        }, 1000);
    }
};

/* MISCELLANEOUS */

room.onRoomLink = function (url) {
    console.log(`${url}\nmasterPassword : ${masterPassword}`);
    if (roomWebhook != '') {
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: `[${getDate()}] 🔗 LINK ${url}\nmasterPassword : ${masterPassword}`,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    }
};

room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
    updateTeams();
    if (!changedPlayer.admin && getRole(changedPlayer) >= Role.ADMIN_TEMP) {
        room.setPlayerAdmin(changedPlayer.id, true);
        return;
    }
    updateAdmins(byPlayer != null && !changedPlayer.admin && changedPlayer.id == byPlayer.id ? changedPlayer.id : 0);
};

room.onKickRateLimitSet = function (min, rate, burst, byPlayer) {
    if (byPlayer != null) {
        room.sendAnnouncement(
            `It is not allowed to change the kickrate limit. It must stay at "6-0-0".`,
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        room.setKickRateLimit(6, 0, 0);
    }
};

room.onStadiumChange = function (newStadiumName, byPlayer) {
    if (byPlayer !== null) {
        if (getRole(byPlayer) < Role.MASTER && currentStadium != 'other') {
            room.sendAnnouncement(
                `No puedes cambiar el mapa manualmente. Por favor, usa los comandos de mapa.`,
                byPlayer.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            stadiumCommand(emptyPlayer, `!${currentStadium}`);
        } else {
            room.sendAnnouncement(
                `Mapa cambiado. Después de terminar con este mapa, por favor usa los comandos de mapa.`,
                byPlayer.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            currentStadium = 'other';
        }
    }
    checkStadiumVariable = true;
};

room.onGameTick = function () {
    checkTime();
    getLastTouchOfTheBall();
    getGameStats();
    handleActivity();
}

// Variables para el sistema de asignación
var autoAssignEnabled = true;
var winnerStays = true;
// Función para cambiar el mapa según el número de jugadores
// Función para cambiar el mapa según el número de jugadores
function updateMapBasedOnPlayerCount() {
    if (!autoAssignEnabled) return;
    
    let playerCount = players.length;
    console.log(`Actualizando mapa basado en cantidad de jugadores: ${playerCount}, mapa actual: ${currentStadium}`);
    
    // Lógica para seleccionar el mapa apropiado
    if (playerCount === 1) {
        if (currentStadium !== 'training') {
            room.sendAnnouncement(
                "🏟️ Cambiando a mapa de entrenamiento para 1 jugador.",
                null,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            // Cargar mapa directamente
            room.setCustomStadium(trainingMap);
            currentStadium = 'training';
        }
    } else if (playerCount >= 2 && playerCount <= 5) {
        if (currentStadium !== 'classic') {
            room.sendAnnouncement(
                "🏟️ Cambiando a mapa clásico para 2-5 jugadores.",
                null,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            // Cargar mapa directamente
            room.setCustomStadium(classicMap);
            currentStadium = 'classic';
        }
    } else if (playerCount >= 6) {
        if (currentStadium !== 'big') {
            room.sendAnnouncement(
                "🏟️ Cambiando a mapa grande para 6+ jugadores.",
                null,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
            // Cargar mapa directamente
            room.setCustomStadium(bigMap);
            currentStadium = 'big';
        }
    }
}
// Función para manejar el formato "ganador sigue"
// Función para manejar el formato "ganador sigue"
// Función para manejar el formato "ganador sigue"
// Función para manejar el formato "ganador sigue"
function handleWinnerStaysFormat() {
    if (!winnerStays || lastWinner === Team.SPECTATORS) return;
    
    // Verificar si es un partido 3v3 (o con equipos grandes)
    const is3v3Match = teamRed.length >= 3 && teamBlue.length >= 3;
    
    // Para partidos 3v3: el ganador pasa al lado AZUL
    if (is3v3Match) {
        // Si el equipo rojo gana, pasa al lado azul
        if (lastWinner === Team.RED) {
            room.sendAnnouncement(
                "🔄 ¡El equipo rojo ganó! Pasando al lado azul.",
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
            
            // Mover el equipo perdedor (azul) a espectadores
            for (let player of teamBlue) {
                room.setPlayerTeam(player.id, Team.SPECTATORS);
            }
            
            // Mover el equipo ganador (rojo) al lado azul
            for (let player of teamRed) {
                room.setPlayerTeam(player.id, Team.BLUE);
            }
        }
        // Si el equipo azul gana, se mantiene en su posición
        else if (lastWinner === Team.BLUE) {
            room.sendAnnouncement(
                "🔄 ¡El equipo azul ganó y mantiene su posición!",
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
            
            // Mover el equipo perdedor (rojo) a espectadores
            for (let player of teamRed) {
                room.setPlayerTeam(player.id, Team.SPECTATORS);
            }
        }
    } 
    // Para otros partidos: comportamiento original (ganador al lado ROJO)
    else {
        // Si el equipo rojo gana, se mantiene en su posición
        if (lastWinner === Team.RED) {
            room.sendAnnouncement(
                "🔄 ¡El equipo rojo ganó y mantiene su posición!",
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
            
            // Mover el equipo perdedor (azul) a espectadores
            for (let player of teamBlue) {
                room.setPlayerTeam(player.id, Team.SPECTATORS);
            }
        }
        // Si el equipo azul gana, pasa al lado rojo
        else if (lastWinner === Team.BLUE) {
            room.sendAnnouncement(
                "🔄 ¡El equipo azul ganó! Pasando al lado rojo.",
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
            
            // Mover el equipo perdedor (rojo) a espectadores
            for (let player of teamRed) {
                room.setPlayerTeam(player.id, Team.SPECTATORS);
            }
            
            // Mover el equipo ganador (azul) al lado rojo
            for (let player of teamBlue) {
                room.setPlayerTeam(player.id, Team.RED);
            }
        }
    }
    
    // Forzar a mostrar la lista de jugadores
    setTimeout(() => {
        if (chooseMode) {
            let captain = null;
            if (teamRed.length <= teamBlue.length && teamRed.length != 0) {
                captain = teamRed[0];
            } else if (teamBlue.length < teamRed.length && teamBlue.length != 0) {
                captain = teamBlue[0];
            }
            
            if (captain != null) {
                getSpecList(captain);
            }
        }
    }, 500); // pequeño retraso para asegurarnos que los equipos están actualizados
}
// Funciones auxiliares para los mensajes de gol
function getRandomGoalEmoji() {
    const emojis = ["⚽", "🔥", "🚀", "💥", "⚡", "🎯", "🌟", "🏆"];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function getRandomAutoGoalEmoji() {
    const emojis = ["😅", "🤦‍♂️", "😱", "😬", "❌", "🙈", "🤷‍♂️"];
    return emojis[Math.floor(Math.random() * emojis.length)];
}


// Función para anunciar los equipos
// Función para anunciar los equipos
// Función para anunciar los equipos
// Función para anunciar los equipos
// Modificar la función anunciarEquipos
function anunciarEquipos() {
    console.log("Anunciando equipos:", teamRedName, "vs", teamBlueName);
    
    // Crear un mensaje de anuncio con estilo y separador superior
    room.sendAnnouncement(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        null, 
        0xFFFFFF
    );
    
    // Anuncio de inicio con emojis llamativos
    room.sendAnnouncement(
        `🎮 ¡COMIENZA EL PARTIDO! 🎮`,
        null,
        0xFFD700,
        "bold"
    );
    
    // Anunciar los equipos con sus nombres según las camisetas y con diseño mejorado
    room.sendAnnouncement(
        `⚔️  ${teamRedName} 🔴  VS  🔵 ${teamBlueName}  ⚔️`,
        null,
        0xFFFFFF,
        "bold"
    );
    
    // Obtener y mostrar información de los jugadores
    let redPlayers = room.getPlayerList().filter(p => p.team === Team.RED);
    let bluePlayers = room.getPlayerList().filter(p => p.team === Team.BLUE);
    
    if (redPlayers.length > 0 || bluePlayers.length > 0) {
        // Separador para las alineaciones
        room.sendAnnouncement(
            "━━━━━━ ALINEACIONES ━━━━━━",
            null, 
            0xFFFFFF,
            "bold"
        );
        
        // Mostrar alineaciones con formato mejorado
        if (redPlayers.length > 0) {
            let redPlayersList = redPlayers.map((p, i) => `${i+1}. ${p.name}`).join("\n");
            room.sendAnnouncement(
                `🔴 ${teamRedName}:\n${redPlayersList}`,
                null,
                0xFF3333
            );
        }
        
        if (bluePlayers.length > 0) {
            let bluePlayersList = bluePlayers.map((p, i) => `${i+1}. ${p.name}`).join("\n");
            room.sendAnnouncement(
                `🔵 ${teamBlueName}:\n${bluePlayersList}`,
                null,
                0x3333FF
            );
        }
        
        // Separador inferior
        room.sendAnnouncement(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            null, 
            0xFFFFFF
        );
        
        // Mensaje de motivación
        room.sendAnnouncement(
            "¡Que gane el mejor equipo! ⚽",
            null,
            0xFFD700,
            "bold"
        );
    }
}
// Función para obtener el emoji correspondiente al nivel
function getLevelEmoji(level) {
    // Asegurarse de que el nivel esté en el rango correcto
    level = Math.max(1, Math.min(100, level));
    
    // Determinar la categoría del nivel (cada 10 niveles)
    const tier = Math.ceil(level / 10);
    
    // Asignar emoji según el tier
    switch (tier) {
        case 1: // Niveles 1-10: Principiante
            return "🔰"; // Principiante japonés
        
        case 2: // Niveles 11-20: Aprendiz
            return "🥉"; // Medalla de bronce
        
        case 3: // Niveles 21-30: Amateur
            return "🥈"; // Medalla de plata
        
        case 4: // Niveles 31-40: Semi-Pro
            return "🥇"; // Medalla de oro
        
        case 5: // Niveles 41-50: Profesional
            return "🏆"; // Trofeo
        
        case 6: // Niveles 51-60: Estrella
            return "⭐"; // Estrella
        
        case 7: // Niveles 61-70: Experto
            return "💎"; // Diamante
        
        case 8: // Niveles 71-80: Maestro
            return "👑"; // Corona
        
        case 9: // Niveles 81-90: Leyenda
            return "🌟"; // Estrella brillante
        
        case 10: // Niveles 91-100: Divino
            return "🔱"; // Tridente
            
        default: // Por si acaso hay niveles por encima de 100
            return "👽"; // Alienígena (más allá de lo humano)
    }
}

// Función para obtener el color correspondiente al nivel
function getLevelColor(level) {
    // Asegurarse de que el nivel esté en el rango correcto
    level = Math.max(1, Math.min(100, level));
    
    // Determinar la categoría del nivel (cada 10 niveles)
    const tier = Math.ceil(level / 10);
    
    // Asignar color según el tier
    switch (tier) {
        case 1: // Niveles 1-10: Verde básico
            return 0x32cd32; // Lima verde
        
        case 2: // Niveles 11-20: Bronce
            return 0xcd7f32; // Bronce
        
        case 3: // Niveles 21-30: Plata
            return 0xc0c0c0; // Plata
        
        case 4: // Niveles 31-40: Oro
            return 0xffd700; // Oro
        
        case 5: // Niveles 41-50: Rojo brillante
            return 0xff4500; // Rojo-naranja
        
        case 6: // Niveles 51-60: Azul eléctrico
            return 0x00bfff; // Azul profundo cielo
        
        case 7: // Niveles 61-70: Púrpura
            return 0x9932cc; // Púrpura oscuro
        
        case 8: // Niveles 71-80: Dorado brillante
            return 0xffb700; // Dorado brillante
        
        case 9: // Niveles 81-90: Azul celeste brillante
            return 0x1e90ff; // Azul dodger
        
        case 10: // Niveles 91-100: Gradiente dorado-blanco
            return 0xffefd5; // Papaya crema
            
        default: // Por si acaso hay niveles por encima de 100
            return 0xffffff; // Blanco puro
    }
}



function levelCommand(player, message) {
    if (!authArray[player.id]) {
        room.sendAnnouncement("Necesitas estar autenticado para ver tu nivel.", player.id, 0xFF0000);
        return false;
    }
    
    const playerAuth = authArray[player.id][0];
    let xp = 0;
    
    // Calcular XP
    if (statsDatabase && statsDatabase.hasOwnProperty(playerAuth)) {
        const stats = statsDatabase[playerAuth];
        xp = (stats.games || 0) * 5 + 
             (stats.wins || 0) * 10 + 
             (stats.goals || 0) * 3 + 
             (stats.assists || 0) * 2 + 
             Math.floor((stats.playtime || 0) / 60);
    }
    
    // Encontrar nivel actual
    const playerLevel = getPlayerLevel(player);
    
    // Encontrar próximo nivel
    let nextLevel = null;
    for (let i = 0; i < playerLevels.length; i++) {
        if (playerLevels[i].level > playerLevel.level) {
            nextLevel = playerLevels[i];
            break;
        }
    }
    
    // Enviar información de nivel
    room.sendAnnouncement(`${playerLevel.emoji} Tu nivel actual es: ${playerLevel.level}`, player.id, playerLevel.color, "bold");
    room.sendAnnouncement(`XP total: ${xp}`, player.id, 0xFFFFFF);
    
    if (nextLevel) {
        const xpNeeded = nextLevel.minXP - xp;
        room.sendAnnouncement(`Necesitas ${xpNeeded} XP más para alcanzar el nivel ${nextLevel.level} ${nextLevel.emoji}`, player.id, 0xFFFFFF);
    } else {
        room.sendAnnouncement("¡Has alcanzado el nivel máximo!", player.id, 0xFFFF00, "bold");
    }
    
    return false;
}



// Función para convertir números a emojis de números 
function replaceNumbers(num) {
    const numberEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    return num.toString().split('').map(digit => numberEmojis[parseInt(digit)]).join('');
}

// Función para convertir segundos a formato minutos:segundos
function secondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Función para celebración con avatares
function avatarCelebration(playerId, emoji) {
    if (!playerId) return;
    
    // Guardar avatar actual
    const player = room.getPlayer(playerId);
    if (!player) return;
    
    const originalAvatar = player.avatar;
    
    // Secuencia de celebración
    const celebrationEmojis = [emoji, "🎉", "👏", emoji];
    let index = 0;
    
    const interval = setInterval(() => {
        if (index < celebrationEmojis.length) {
            room.setPlayerAvatar(playerId, celebrationEmojis[index]);
            index++;
        } else {
            // Restaurar avatar original
            room.setPlayerAvatar(playerId, originalAvatar);
            clearInterval(interval);
        }
    }, 500); // Cambiar cada 500ms
}

// Función para elegir el siguiente jugador de la lista de espectadores
function pickNextPlayers() {
    let availableSpecs = teamSpec.filter(p => !AFKSet.has(p.id));
    
    if (availableSpecs.length === 0) {
        room.sendAnnouncement(
            "⚠️ No hay espectadores disponibles para unirse al juego.",
            null,
            warningColor,
            'bold',
            HaxNotification.CHAT
        );
        return;
    }
    
    // Mostrar la lista de jugadores disponibles
    let listaJugadores = "📋 Jugadores disponibles:\n";
    availableSpecs.forEach((player, index) => {
        listaJugadores += `${index + 1}. ${player.name}\n`;
    });
    
    room.sendAnnouncement(
        listaJugadores,
        null,
        infoColor,
        'bold',
        HaxNotification.CHAT
    );
    
    // Determinar cuántos jugadores necesitamos para el equipo azul
    let playersNeeded = teamRed.length - teamBlue.length;
    if (playersNeeded <= 0) playersNeeded = teamRed.length;
    
    // No elegir más jugadores de los disponibles
    playersNeeded = Math.min(playersNeeded, availableSpecs.length);
    
    if (playersNeeded > 0) {
        // Dar un pequeño anuncio informativo antes de seleccionar
        room.sendAnnouncement(
            `🔵 En 3 segundos se elegirán automáticamente ${playersNeeded} jugador(es) para el equipo azul...`,
            null,
            blueColor,
            'bold',
            HaxNotification.CHAT
        );
        
        // Agregamos un pequeño retraso para dar tiempo a los admins a elegir manualmente si quieren
        setTimeout(function() {
            // Verificar nuevamente los equipos en caso de que hayan habido cambios manuales
            let currentAvailableSpecs = teamSpec.filter(p => !AFKSet.has(p.id));
            if (currentAvailableSpecs.length === 0) return;
            
            // Recalcular jugadores necesarios
            let currentPlayersNeeded = teamRed.length - teamBlue.length;
            if (currentPlayersNeeded <= 0) currentPlayersNeeded = teamRed.length;
            currentPlayersNeeded = Math.min(currentPlayersNeeded, currentAvailableSpecs.length);
            
            if (currentPlayersNeeded > 0) {
                let jugadoresElegidos = [];
                
                for (let i = 0; i < currentPlayersNeeded; i++) {
                    room.setPlayerTeam(currentAvailableSpecs[i].id, Team.BLUE);
                    jugadoresElegidos.push(currentAvailableSpecs[i].name);
                }
                
                room.sendAnnouncement(
                    `✅ Jugadores elegidos para el equipo azul: ${jugadoresElegidos.join(", ")}`,
                    null,
                    successColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        }, 3000); // 3 segundos de espera
    }
}

// Comando para activar/desactivar el sistema automático
function toggleAutoAssignCommand(player, message) {
    if (getRole(player) < Role.ADMIN_TEMP) {
        room.sendAnnouncement(
            "❌ No tienes permisos para usar este comando.",
        player.id,
            errorColor,
        'bold',
            HaxNotification.CHAT
        );
        return false;
    }
    
    autoAssignEnabled = !autoAssignEnabled;
    room.sendAnnouncement(
        `⚙️ Sistema de asignación automática ${autoAssignEnabled ? 'activado' : 'desactivado'}.`,
        null,
        successColor,
        'bold',
        HaxNotification.CHAT
    );
}

// Comando para activar/desactivar el formato "ganador sigue"
function toggleWinnerStaysCommand(player, message) {
    if (getRole(player) < Role.ADMIN_TEMP) {
        room.sendAnnouncement(
            "❌ No tienes permisos para usar este comando.",
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
        );
        return false;
    }
    
    winnerStays = !winnerStays;
    room.sendAnnouncement(
        `⚙️ Formato "ganador sigue" ${winnerStays ? 'activado' : 'desactivado'}.`,
        null,
        successColor,
        'bold',
        HaxNotification.CHAT
    );
}

// Añadir comandos al objeto commands existente
commands.autoassign = {
    aliases: ['auto'],
    roles: Role.ADMIN_TEMP,
    desc: `
    Este comando activa o desactiva el sistema de asignación automática de jugadores y mapas.`,
    function: toggleAutoAssignCommand,
};

commands.winnerstays = {
    aliases: ['ws'],
    roles: Role.ADMIN_TEMP,
    desc: `
    Este comando activa o desactiva el formato "ganador sigue" donde el equipo ganador se mantiene y los perdedores salen.`,
    function: toggleWinnerStaysCommand,
};


// Versión original modificada mejorada
const originalHandlePlayersJoin = handlePlayersJoin;
handlePlayersJoin = function() {
    console.log("⚠️ Función handlePlayersJoin ejecutada");
    originalHandlePlayersJoin();
    // Forzar actualización del mapa
    updateMapBasedOnPlayerCount();
};

// Versión original modificada mejorada
const originalHandlePlayersStop = handlePlayersStop;
handlePlayersStop = function(byPlayer) {
    console.log("⚠️ Función handlePlayersStop ejecutada");
    originalHandlePlayersStop(byPlayer);
    if (byPlayer == null && endGameVariable && autoAssignEnabled) {
        handleWinnerStaysFormat();
    }
};
