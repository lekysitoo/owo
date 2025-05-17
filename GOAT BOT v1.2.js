/* ROOM */
const roomName = "🐐 𝐆𝐎𝐀𝐓 𝐋𝐄𝐕𝐄𝐋  🐐  🔵   BIG X3   🔵";
const botName = "Judge";
const maxPlayers = 16; // maximum number of players in the room
const roomPublic = true; // true = public room | false = players only enter via the room link (it does not appear in the room list)
// Usá = en lugar de : para asignar el valor
const geo = { code: "ar", lat: -34.6374, lon: -58.4058 };
const room = HBInit({
    roomName: roomName,
    maxPlayers: maxPlayers,
    public: roomPublic,
    playerName: botName,
    noPlayer: true,
    geo
});
    

const scoreLimitPractice = 3;
const timeLimitPractice = 3;
const FIREBASE_URL = "https://haxhost-uwu-default-rtdb.firebaseio.com";
const FIREBASE_API_KEY = "AIzaSyAITBZT1r1tYRNXMxmg4w6ZWkEW-en8TX0";


// Función para interactuar con Firebase
function firebaseFetch(path, options = {}) {
    const url = `${FIREBASE_URL}/${path}.json?auth=${FIREBASE_API_KEY}`;
    return fetch(url, options)
        .then(response => response.json());
}


// Reiniciar variables de reinicio
reinicioSolicitado = false;
jugadorSolicitanteReinicio = null;
equipoSolicitanteReinicio = null;
confirmacionesReinicio = [];


// Función auxiliar para verificar permisos
function hasPermission(player, requiredRole) {
return getRole(player) >= requiredRole;
}
function saveUser(player, password) {
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth. Reconectate a la sala.", player.id, 0xFF0000);
        return;
    }

    // Guardar en Firebase
    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(existingData => {
        if (existingData) {
            room.sendAnnouncement("❌ Ya estás registrado!", player.id, 0xFF0000);
            return;
        }

        // Crear stats iniciales
        const initialStats = {
            name: player.name,
            role: Role.PLAYER,
            password: password,
            registeredDate: Date.now(),
            stats: {
                games: 0,
                wins: 0,
                goals: 0,
                assists: 0,
                cs: 0,
                gk: 0
            }
        };

        // Guardar en Firebase
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(initialStats)
        });
    })
    .then(() => {
        room.sendAnnouncement("✅ ¡Registro exitoso! Tus stats serán guardados", player.id, 0x00FF00);
        playerRoles.set(auth, Role.PLAYER); // Asegurar que tenga rol de jugador
    })
    .catch(error => {
        console.error("Error registrando usuario:", error);
        room.sendAnnouncement("❌ Error al registrar", player.id, 0xFF0000);
    });
}
function loginUser(player, password) {
    const auth = getAuth(player);
    if (!auth) {
        room.sendAnnouncement("❌ No se detectó tu auth. Reconectate a la sala.", player.id, 0xFF0000);
        return false;
    }

    const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(userData => {
        if (!userData) {
            room.sendAnnouncement("❌ No estás registrado. Usá !register <contraseña>", player.id, 0xFF0000);
            return;
        }

        // Si es login automático (password es null) o la contraseña coincide
        if (password === null || userData.password === password) {
            room.sendAnnouncement(`✅ ¡Bienvenido de nuevo ${player.name}!`, player.id, 0x00FF00);
            
            // Verificar si también es admin
            const adminUrl = `${FIREBASE_URL}/admins/${auth}.json?auth=${FIREBASE_API_KEY}`;
            fetch(adminUrl)
            .then(response => response.json())
            .then(adminData => {
                if (adminData) {
                    playerRoles.set(auth, adminData.role);
                    setPlayerRole(player, adminData.role);
                } else {
                    playerRoles.set(auth, Role.PLAYER);
                }
            });

            return true;
        }
        room.sendAnnouncement("❌ Contraseña incorrecta!", player.id, 0xFF0000);
        return false;
    })
    .catch(error => {
        console.error("Error en login:", error);
        room.sendAnnouncement("❌ Error al iniciar sesión", player.id, 0xFF0000);
        return false;
    });
}


// Función auxiliar para completar el login
function completeLogin(player, userData) {
    // Restauramos el rol guardado
    if (userData.role) {
        setPlayerRole(player, userData.role);
    }

    // Actualizamos último login
    userData.lastLogin = Date.now();
    
    // Guardamos los cambios
    fetch(`${FIREBASE_URL}/users/${player.auth}.json?auth=${FIREBASE_API_KEY}`, {
        method: 'PATCH',
        body: JSON.stringify({ lastLogin: userData.lastLogin })
    });

    
    // Si tiene rol especial, lo anunciamos
    if (userData.role && userData.role !== Role.USER) {
        let roleName = getRoleName(userData.role);
        room.sendAnnouncement(`👑 ${player.name} ha ingresado como ${roleName}!`, null, 0xffb02e, "bold");
    }
}

var currentMap = null;

// Probá primero esto para ver si conecta

const camisetasEquipos = {
// Funciones del sistema de camisetas (disponibles globalmente)
// RIVER PLATE
"riv/titular/red": {
    codigo: "/colors red 30 231F20 FFFFFF EE1B2C FFFFFF",
    nombreEquipo: "RIVER PLATE",
},
"riv/titular/blue": {
    codigo: "/colors blue 30 231F20 FFFFFF DA291C FFFFFF",
    nombreEquipo: "RIVER PLATE",
},
"riv/alternativa/red": {
    codigo: "/colors red 64 FFFFFF F0232F 312B31 281F22",
    nombreEquipo: "RIVER PLATE",
},
"riv/alternativa/blue": {
    codigo: "/colors blue 64 FFFFFF F0232F 312B31 281F22",
    nombreEquipo: "RIVER PLATE",
},
"riv/tercera/red": {
    codigo: "/colors red 180 271D1C F71E26 F0F1F5 F71E26",
    nombreEquipo: "RIVER PLATE",
},
"riv/tercera/blue": {
    codigo: "/colors blue 180 271D1C F71E26 F0F1F5 F71E26",
    nombreEquipo: "RIVER PLATE",
},

// BOCA JUNIORS
"boc/titular/red": {
    codigo: "/colors red 90 FFFFFF 033F86 FAB900 033F86",
    nombreEquipo: "BOCA JUNIORS",
},
"boc/titular/blue": {
    codigo: "/colors blue 90 FFFFFF 033F86 FAB900 033F86",
    nombreEquipo: "BOCA JUNIORS",
},
"boc/alternativa/red": {
    codigo: "/colors red 134 00448B C9C5D3 D4CEDA D4CEDA",
    nombreEquipo: "BOCA JUNIORS",
},
"boc/alternativa/blue": {
    codigo: "/colors blue 134 00448B C9C5D3 D4CEDA D4CEDA",
    nombreEquipo: "BOCA JUNIORS",
},
"boc/tercera/red": {
    codigo: "/colors red 118 142090 EBE12F",
    nombreEquipo: "BOCA JUNIORS",
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


let Cor = {
    Vermelho: 0xFA5646,
    Laranja: 0xFFC12F,
    Verde: 0x7DFA89,
    Azul: 0x05C5FF,
    Amarelo: 0xFFFF17,
    Cinza: 0xCCCCCC,
    Branco: 0xFFFFFF,
    Azulclaro: 0x6ECAFF,
    Powderblue: 0xB0E0E6,
    Roxo: 0x800080,
    Platinum: 0xE5E4E2,
    Gold: 0xffd700,
    Silver: 0xd5d5d5,
    Bronze: 0x896728,
    Thistle: 0xD8BFD8,
    Khaki: 0xF0E68C,
    AliceBlue: 0xF0F8FF,
    GhostWhite: 0xF8F8FF,
    Snow: 0xFFFAFA,
    Seashell:0xFFF5EE,
    FloralWhite: 0xFFFAF0,
    WhiteSmoke: 0xF5F5F5,
    Beige: 0xF5F5DC,
    OldLace: 0xFDF5E6,
    Ivory: 0xFFFFF0,
    Linen: 0xFAF0E6,
    Cornsilk: 0xFFF8DC,
    AntiqueWhite: 0xFAEBD7,
    BlanchedAlmond: 0xFFEBCD,
    Bisque: 0xFFE4C4,
    LightYellow: 0xFFFFE0,
    LemonChiffon: 0xFFFACD,
    LightGoldenrodYellow: 0xFAFAD2,
    PapayaWhip: 0xFFEFD5,
    PeachPuff: 0xFFDAB9,
    Moccasin: 0xFFE4B5,
    PaleGoldenrod: 0xEEE8AA,
    Azulescuro: 0x426AD6,
    Warn: 0xff9966
        }

// Mensajes rápidos usando números
const quickMessages = {
    "10": "¡VAMOS CARAJO! 💪⚽",
    "11": "¡QUE GOLAZO! 🚀⭐",
    "12": "¡PARADÓN DEL ARQUERO! 🧤👐",
    "13": `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀
    ⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀
    ⠀⠀⠀⠀⢀⣀⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿⠀
    ⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀⠀⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇
    ⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋⠁⠀⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿
    ⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⣿⣿⡟
    ⠙⢹⣿⣿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
    ⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    AGARRAMELA QUE CRECE!!! JAAAAAAAAA JAJAA 🤣`,
    "14": "¡ESO NO ES FALTA NI EN RUGBY! 🏉😤",
    "15": "¡AMARILLA PARA EL ÁRBITRO! 💛🤡",
    "16": "¡MESSI, MESSIRVE, MESSIRVIÓ! 🐐👑",
    "17": "¡SIUUUUUUUUU! 🦵💫",
    "18": "¡BAILA VINI, BAILA! 🕺💃",
    "19": "¡ANKARA MESSI, ANKARA MESSI! 🌟🔥",
    "20": "¡NO ERA CORNER NI EN CHINA! 🇨🇳😠",
    "21": "¡ROJA DIRECTA Y 3 PARTIDOS! 🟥😡",
    "22": "¡PARADÓN DEL DIBU! 🧤🇦🇷",
    "23": "¡PELÉ DEBUTÓ CON UN PIBE! 👶⚽",
    "24": "¡ESO ES ROJA HASTA EN EL FIFA! 🎮🟥",
    "25": "¡PECHO FRÍO! ❄️🥶",
    "26": "¡MUCHO TIKITAKA Y POCO RESULTADO! ⚽😴",
    "27": "¡PARA QUÉ TE TRAJE! 🤦‍♂️😤",
    "28": "¡ESTE PARTIDO LO DA VUELTA HASTA MI ABUELA! 👵💪",
    "29": "¡SACÁ DEL MEDIO! 🚀⚽",
    "30": "¡MODO MARADONA ACTIVADO! 🔟✨",
    "31": "¡TIKI TAKA TIKI TAKA! ⚽️👟",
    "32": "¡ESTE EQUIPO ES UN HOSPITAL! 🏥🤕",
    "33": "¡AFUERA LA PLAY, ADENTRO LA REALIDAD! 🎮😤",
    "34": "¡VAMOS A DEFENDER CON TODO! 🛡️💪",
    "35": "¡HOY SE SALE CAMPEÓN! 🏆✨",
    "36": "¡MODO CHAMPIONS ACTIVADO! 🌟🏆",
    "37": "¡ESTE ARBITRO ES UN MEME! 🤡😂",
    "38": "¡DEJA DE LLORAR Y JUEGA! 😭👶",
    "39": "¡PURO HUMO! 💨😤",
    "40": "¡SE VIENE EL REMONTADA! 💪🔄",
    "41": "¡PARKINGBUS ACTIVADO! 🚌😎",
    "42": "¡MODO HEXA BRASIL! 🇧🇷✨",
    "43": "¡LA TENÉS ADENTRO! 😎🔥",
    "44": "¡VAMOS AL MCDONALDS SI GANAMOS! 🍔🏆",
    "45": "¡+10 DE FAIR PLAY! 🤝👏",
    "46": "¡ESTE PARTIDO ES MÁS ABURRIDO QUE JUGAR AL AJEDREZ! ♟️😴",
    "47": "¡MODO TSUBASA ACTIVADO! 🌟⚽",
    "48": "¡AQUÍ HAY MÁS TEATRO QUE EN BROADWAY! 🎭🎬",
    "49": "¡ESTE EQUIPO DA MÁS VUELTAS QUE UN TROMPO! 🌀😵",
    "50": "¡MODO BARRILETE CÓSMICO! 🌌⚽",
    "51": "¡LA TOCÁS O TE CAMBIO! 😠👋",
    "52": "¡JUGÁ SIMPLE, NO TE HAGÁS EL NEYMAR! 🤹‍♂️😤",
    "53": "¡MODO TIKI TAKA CHAMPAGNE! 🍾✨",
    "54": "¡MÁS PERDIDO QUE JUGADOR DEL UNITED! 😅🔍",
    "55": "¡ESTE PARTIDO ESTÁ MÁS CERRADO QUE CERROJO SUIZO! 🔒🇨🇭",
    "56": "¡MODO CATENACCIO ACTIVADO! 🇮🇹🔒",
    "57": "¡ESTE ÁRBITRO TIENE EL VAR EN LOS OJOS! 👀📺",
    "58": "¡MODO JOGA BONITO! 🇧🇷✨",
    "59": "¡ESTE PARTIDO ES UN CHORIZO! 🌭😤",
    "60": "¡MODO PULGA ATÓMICA! 🐜⚡",
    "61": "¡ESTE EQUIPO ES PURO TIKI TAKA Y NADA DE GOLES! ⚽😴",
    "62": "¡MODO BICHO ACTIVADO! 🐐💫",
    "63": "¡ESTE PARTIDO ESTÁ MÁS CALIENTE QUE ASADO DE DOMINGO! 🔥🍖",
    "64": "¡MODO CRUIJFF TOTAL! 🔄🌟",
    "65": "¡LA GAMBETA ES MI PASAPORTE! 🎯💫",
    "66": "¡MODO FÚTBOL CHAMPAGNE! 🍾⚽",
    "67": "¡ESTE PARTIDO ES UN BOSTERO! 💙💛",
    "68": "¡MODO GALÁCTICO ACTIVADO! 🌟👑",
    "69": "¡ESTE PARTIDO ESTÁ MÁS TRABADO QUE WINDOWS 95! 💻😤",
    "70": "¡MODO LEYENDA ACTIVADO! 🏆✨",
    "420": "🌿 ¡${player.name} SE FUE A FUMAR! 💨 ESTARÁ AUSENTE POR LOS SIGUIENTES MINUTOS... 🚬 ¡NO LO MOLESTEN, ESTÁ EN SU MOMENTO ZEN! 🧘‍♂️ MODO SNOOP DOGG ACTIVADO 🐕 VOLVERÁ CUANDO SE ACABE LA MAGIA 🪄✨ (O CUANDO LE DE HAMBRE 🍕)",
    "71": "¡MODO GAMER ACTIVADO! 🎮 ¡RGB = +1000 DE SKILLS! 🌈 ¡GAMING CHAIR POWER! 💺",
    "72": "¡SOY MAIN ARQUERO! 🧤 ¡LITERALMENTE MEJOR QUE NEUER! 🥅 ¡PURO SKILL NO HACK! 🚫",
    "73": "¡NASHEEEEE! 🔥 ¡MODO DIABLO! 😈 ¡LITERALMENTE CRACKED! 💯 ¡SHEEEESH! 🥶",
    "74": "¡ESTE SERVER ESTÁ MÁS MUERTO QUE MI SETUP! 💀 ¡NEED PLAYERS! 🙏 ¡NO BOTS PLS! 🤖",
    "75": "¡LITERALMENTE MEJOR QUE EL DIBU! 🧤 ¡MIRÁ QUE TE COMO HERMANO! 🐊 ¡DALE QUE HOY ATAJO TODO! 🚫",
    "76": "¡MODO TRYHARD ON! 😤 ¡LITERALLY TOCANDO PASTO! 🌱 ¡NO LIFE GAMING! 🎮",
    "77": "¡LITERAL NO DEJO PASAR NI EL AIRE! 💨 ¡PURO CHILL STREAM! 😎 ¡MODO RELAX! 🧘‍♂️",
    "78": "¡SPEEDRUN DE GOLES! 🏃‍♂️ ¡ANY% GLITCHLESS! ⚡ ¡WORLD RECORD PACE! 🏆",
    "79": "¡MODO ESPORTS! 🎯 ¡LITERALMENTE MEJOR QUE ENCE! 🔥 ¡READY FOR TOURNAMENT! 🏆",
    "80": "¡LITERAL IN THE ZONE! 🎯 ¡ULTRA INSTINCT ACTIVATED! ⚡ ¡POV: MAIN CHARACTER! 🌟",
    "81": "¡MODO TILT PROOF! 😤 ¡NO RAGE TODAY! 🧘‍♂️ ¡PURA BUENA VIBRA! ✨",
    "82": "¡LITERALMENTE HACIENDO CLIP! 🎬 ¡CONTENT CREATOR MODE! 🎥 ¡LIKE Y SUSCRIBE! 👍",
    "83": "¡MODO AFK PERO NO AFK! 😴 ¡LITERALLY SLEEPING! 💤 ¡BUT STILL WINNING! 🏆",
    "84": "¡POV: ERES MI CONTENIDO! 📸 ¡LITERAL MATERIAL PARA YOUTUBE! 🎥 ¡THUMBNAIL MOMENT! 🖼️",
    "85": "¡LITERALMENTE MEJOR QUE TU MAIN! 💪 ¡GIT GUD SCRUB! 😎 ¡EZ GAME EZ LIFE! 🎮",
    "86": "¡MODO SMURF ACTIVADO! 🥸 ¡LITERALLY BOOSTING! 📈 ¡PERO SIN BOOST! 🚫",
    "87": "¡LITERAL GAMING WARLORD! 👑 ¡CRACKED AT HAXBALL! 🎮 ¡ACTUALLY INSANE! 🤪",
    "88": "¡MODO COACH! 👨‍🏫 ¡LITERALLY TEACHING! 📚 ¡CLASE MAGISTRAL! 🎓",
    "89": "¡LITERALMENTE MEJOR QUE AYER! 📈 ¡PERO PEOR QUE MAÑANA! 🔮 ¡PURO PROGRESO! 💪",
    "90": "¡MODO MANCO'NT! 🦾 ¡LITERALLY SKILLED! 🎯 ¡NO HACKS JUST TALENT! ✨",
    "91": "¡POV: ME REPORTAN POR HACKS! 🚫 ¡PERO SOY LEGIT! ✅ ¡LITERALLY CLEAN! 🧼",
    "92": "¡LITERAL FARMING WINS! 🌾 ¡COSECHA DE VICTORIAS! 🏆 ¡MODO GRANJERO! 🚜",
    "93": "¡MODO STREAMER SIN STREAM! 🎥 ¡LITERALLY FAMOUS! 🌟 ¡PERO SIN VIEWERS! 👻",
    "94": "¡POV: TUTORIAL DE CÓMO SER PRO! 📚 ¡PASO 1: SER YO! 😎 ¡PASO 2: GG EZ! 🎮",
    "95": "¡LITERALMENTE MEJOR QUE EL LAG! 📶 ¡999 PING WARRIOR! ⚔️ ¡PERO SIGO VIVO! 💪",
    "96": "¡MODO HACKER'NT!  ¡LITERALLY LEGIT! ✅ ¡PURO SKILL NO FAKE! 💯",
    "97": "¡POV: SPEEDRUN DE TOXICIDAD! 🏃‍♂️ ¡PERO CON AMOR! ❤️ ¡LITERAL WHOLESOME! 🌈",
    "98": "¡LITERAL GOD GAMING! 🎮 ¡PERO SIN PRESUMIR! 😇 ¡MODO HUMILDE! 🙏",
    "99": "¡MODO PRO PLAYER! 😎 ¡LITERALLY BUILT DIFFERENT! 💪 ¡GAMING WARLORD! 👑",
    "100": "¡LITERALLY RANKED #1! 🏆 ¡MODO LEYENDA! 👑 ¡PERO SIN FANFARRONEAR! 🤫"
};

const secondsToResetAvatar = 3;
var registro = new Map();
const css = "border:2px solid;padding:8px;background:";
room.setTeamsLock(true);
var message;
var Botdivulga;
var msg1;
var msg1Time = 1500000;
var Deus = [];
var BotdivulgaTime = 900000;
var adminPassword = 4002;

var vip1 = [];
var vip2 = [];
var vip3 = [];

/* ESTÁDIO */

const playerRadius = 15;
var ballRadius = 6.25;
const triggerDistance = playerRadius + ballRadius + 0.01;

var practiceMap = `{
    "name": "AHA Classic (Training) v2.1",
    "width": 420,
    "height": 200,
    "bg": {
        "type": "grass",
        "width": 370,
        "height": 170,
        "kickOffRadius": 75
    },
    "vertexes": [{
        "x": -370,
        "y": 170,
        "cMask": ["ball"]
    }, {
        "x": -370,
        "y": 64,
        "cMask": ["ball"]
    }, {
        "x": -370,
        "y": -64,
        "cMask": ["ball"]
    }, {
        "x": -370,
        "y": -170,
        "cMask": ["ball"]
    }, {
        "x": 370,
        "y": 170,
        "cMask": ["ball"]
    }, {
        "x": 370,
        "y": 64,
        "cMask": ["ball"]
    }, {
        "x": 370,
        "y": -64,
        "cMask": ["ball"]
    }, {
        "x": 370,
        "y": -170,
        "cMask": ["ball"]
    }, {
        "x": -380,
        "y": -64,
        "bCoef": 3,
        "cMask": ["ball"]
    }, {
        "x": -400,
        "y": -44,
        "bCoef": 3,
        "cMask": ["ball"]
    }, {
        "x": -400,
        "y": 44,
        "bCoef": 3,
        "cMask": ["ball"]
    }, {
        "x": -380,
        "y": 64,
        "bCoef": 3,
        "cMask": ["ball"]
    }, {
        "x": 380,
        "y": -64,
        "bCoef": 3,
        "cMask": ["ball"]
    }, {
        "x": 400,
        "y": -44,
        "bCoef": 3,
        "cMask": ["ball"]
    }, {
        "x": 400,
        "y": 44,
        "bCoef": 3,
        "cMask": ["ball"]
    }, {
        "x": 380,
        "y": 64,
        "bCoef": 3,
        "cMask": ["ball"]
    }],
    "segments": [{
        "v0": 0,
        "v1": 1,
        "bias": -40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 2,
        "v1": 3,
        "bias": -40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 4,
        "v1": 5,
        "bias": 40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 6,
        "v1": 7,
        "bias": 40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 9,
        "v1": 8,
        "bCoef": 3,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 9,
        "v1": 10,
        "bCoef": 3,
        "cMask": ["ball"]
    }, {
        "v0": 11,
        "v1": 10,
        "bCoef": 3,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 12,
        "v1": 13,
        "bCoef": 3,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 13,
        "v1": 14,
        "bCoef": 3,
        "cMask": ["ball"]
    }, {
        "v0": 14,
        "v1": 15,
        "bCoef": 3,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }],
    "planes": [{
        "normal": [0, 1],
        "dist": -170,
        "cMask": ["ball"]
    }, {
        "normal": [0, -1],
        "dist": -170,
        "cMask": ["ball"]
    }, {
        "normal": [0, 1],
        "dist": -200,
        "bCoef": 0.1
    }, {
        "normal": [0, -1],
        "dist": -200,
        "bCoef": 0.1
    }, {
        "normal": [1, 0],
        "dist": -420,
        "bCoef": 0.1
    }, {
        "normal": [-1, 0],
        "dist": -420,
        "bCoef": 0.1
    }],
    "goals": [],
    "discs": [{
        "radius": 9.3,
        "bCoef": 0.45,
        "invMass": 1.12,
        "damping": 0.9893,
        "cGroup": ["ball", "kick", "score"]
    }, {
        "pos": [-370, 64],
        "radius": 8,
        "invMass": 0,
        "color": "FFCCCC"
    }, {
        "pos": [-370, -64],
        "radius": 8,
        "invMass": 0,
        "color": "FFCCCC"
    }, {
        "pos": [370, 64],
        "radius": 8,
        "invMass": 0,
        "color": "CCCCFF"
    }, {
        "pos": [370, -64],
        "radius": 8,
        "invMass": 0,
        "color": "CCCCFF"
    }],
    "playerPhysics": {},
    "ballPhysics": "disc0",
    "spawnDistance": 30

}`


var bigMap = `{
    "name": "AHA Big v2.1",
    "width": 600,
    "height": 270,
    "bg": {
        "type": "grass",
        "width": 550,
        "height": 240,
        "kickOffRadius": 80
    },
    "vertexes": [{
        "x": -550,
        "y": 240,
        "cMask": ["ball"]
    }, {
        "x": -550,
        "y": 80,
        "cMask": ["ball"]
    }, {
        "x": -550,
        "y": -80,
        "cMask": ["ball"]
    }, {
        "x": -550,
        "y": -240,
        "cMask": ["ball"]
    }, {
        "x": 550,
        "y": 240,
        "cMask": ["ball"]
    }, {
        "x": 550,
        "y": 80,
        "cMask": ["ball"]
    }, {
        "x": 550,
        "y": -80,
        "cMask": ["ball"]
    }, {
        "x": 550,
        "y": -240,
        "cMask": ["ball"]
    }, {
        "x": 0,
        "y": 270,
        "bCoef": 0.1,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "x": 0,
        "y": 80,
        "bCoef": 0.1,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "x": 0,
        "y": -80,
        "bCoef": 0.1,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "x": 0,
        "y": -270,
        "bCoef": 0.1,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "x": -560,
        "y": -80,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": -580,
        "y": -60,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": -580,
        "y": 60,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": -560,
        "y": 80,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": 560,
        "y": -80,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": 580,
        "y": -60,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": 580,
        "y": 60,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": 560,
        "y": 80,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }],
    "segments": [{
        "v0": 0,
        "v1": 1,
        "bias": -40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 2,
        "v1": 3,
        "bias": -40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 4,
        "v1": 5,
        "bias": 40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 6,
        "v1": 7,
        "bias": 40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 13,
        "v1": 12,
        "bCoef": 0.1,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 13,
        "v1": 14,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "v0": 15,
        "v1": 14,
        "bCoef": 0.1,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 16,
        "v1": 17,
        "bCoef": 0.1,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 17,
        "v1": 18,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "v0": 18,
        "v1": 19,
        "bCoef": 0.1,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 8,
        "v1": 9,
        "bCoef": 0.1,
        "vis": false,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "v0": 9,
        "v1": 10,
        "bCoef": 0.1,
        "curve": 180,
        "curveF": 6.123233995736766e-17,
        "vis": false,
        "cMask": ["red", "blue"],
        "cGroup": ["blueKO"]
    }, {
        "v0": 10,
        "v1": 9,
        "bCoef": 0.1,
        "curve": 180,
        "curveF": 6.123233995736766e-17,
        "vis": false,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO"]
    }, {
        "v0": 10,
        "v1": 11,
        "bCoef": 0.1,
        "vis": false,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }],
    "planes": [{
        "normal": [0, 1],
        "dist": -240,
        "cMask": ["ball"]
    }, {
        "normal": [0, -1],
        "dist": -240,
        "cMask": ["ball"]
    }, {
        "normal": [0, 1],
        "dist": -270,
        "bCoef": 0.1
    }, {
        "normal": [0, -1],
        "dist": -270,
        "bCoef": 0.1
    }, {
        "normal": [1, 0],
        "dist": -600,
        "bCoef": 0.1
    }, {
        "normal": [-1, 0],
        "dist": -600,
        "bCoef": 0.1
    }],
    "goals": [{
        "p0": [-550, 80],
        "p1": [-550, -80],
        "team": "red"
    }, {
        "p0": [550, 80],
        "p1": [550, -80],
        "team": "blue"
    }],
    "discs": [{
        "radius": 9.3,
        "bCoef": 0.45,
        "invMass": 1.12,
        "damping": 0.9893,
        "cGroup": ["ball", "kick", "score"]
    }, {
        "pos": [-550, 80],
        "radius": 8,
        "invMass": 0,
        "color": "FFCCCC"
    }, {
        "pos": [-550, -80],
        "radius": 8,
        "invMass": 0,
        "color": "FFCCCC"
    }, {
        "pos": [550, 80],
        "radius": 8,
        "invMass": 0,
        "color": "CCCCFF"
    }, {
        "pos": [550, -80],
        "radius": 8,
        "invMass": 0,
        "color": "CCCCFF"
    }],
    "playerPhysics": {},
    "ballPhysics": "disc0",
    "spawnDistance": 350

}`

var classicMap = `{

    "name": "AHA Classic v2.1",
    "width": 420,
    "height": 200,
    "bg": {
        "type": "grass",
        "width": 370,
        "height": 170,
        "kickOffRadius": 75
    },
    "vertexes": [{
        "x": -370,
        "y": 170,
        "cMask": ["ball"]
    }, {
        "x": -370,
        "y": 64,
        "cMask": ["ball"]
    }, {
        "x": -370,
        "y": -64,
        "cMask": ["ball"]
    }, {
        "x": -370,
        "y": -170,
        "cMask": ["ball"]
    }, {
        "x": 370,
        "y": 170,
        "cMask": ["ball"]
    }, {
        "x": 370,
        "y": 64,
        "cMask": ["ball"]
    }, {
        "x": 370,
        "y": -64,
        "cMask": ["ball"]
    }, {
        "x": 370,
        "y": -170,
        "cMask": ["ball"]
    }, {
        "x": 0,
        "y": 200,
        "bCoef": 0.1,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "x": 0,
        "y": 75,
        "bCoef": 0.1,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "x": 0,
        "y": -75,
        "bCoef": 0.1,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "x": 0,
        "y": -200,
        "bCoef": 0.1,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "x": -380,
        "y": -64,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": -400,
        "y": -44,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": -400,
        "y": 44,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": -380,
        "y": 64,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": 380,
        "y": -64,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": 400,
        "y": -44,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": 400,
        "y": 44,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "x": 380,
        "y": 64,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }],
    "segments": [{
        "v0": 0,
        "v1": 1,
        "bias": -40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 2,
        "v1": 3,
        "bias": -40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 4,
        "v1": 5,
        "bias": 40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 6,
        "v1": 7,
        "bias": 40,
        "vis": false,
        "cMask": ["ball"]
    }, {
        "v0": 13,
        "v1": 12,
        "bCoef": 0.1,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 13,
        "v1": 14,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "v0": 15,
        "v1": 14,
        "bCoef": 0.1,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 16,
        "v1": 17,
        "bCoef": 0.1,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 17,
        "v1": 18,
        "bCoef": 0.1,
        "cMask": ["ball"]
    }, {
        "v0": 18,
        "v1": 19,
        "bCoef": 0.1,
        "curve": 89.99999999999999,
        "curveF": 1.0000000000000002,
        "cMask": ["ball"]
    }, {
        "v0": 8,
        "v1": 9,
        "bCoef": 0.1,
        "vis": false,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }, {
        "v0": 9,
        "v1": 10,
        "bCoef": 0.1,
        "curve": 180,
        "curveF": 6.123233995736766e-17,
        "vis": false,
        "cMask": ["red", "blue"],
        "cGroup": ["blueKO"]
    }, {
        "v0": 10,
        "v1": 9,
        "bCoef": 0.1,
        "curve": 180,
        "curveF": 6.123233995736766e-17,
        "vis": false,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO"]
    }, {
        "v0": 10,
        "v1": 11,
        "bCoef": 0.1,
        "vis": false,
        "cMask": ["red", "blue"],
        "cGroup": ["redKO", "blueKO"]
    }],
    "planes": [{
        "normal": [0, 1],
        "dist": -170,
        "cMask": ["ball"]
    }, {
        "normal": [0, -1],
        "dist": -170,
        "cMask": ["ball"]
    }, {
        "normal": [0, 1],
        "dist": -200,
        "bCoef": 0.1
    }, {
        "normal": [0, -1],
        "dist": -200,
        "bCoef": 0.1
    }, {
        "normal": [1, 0],
        "dist": -420,
        "bCoef": 0.1
    }, {
        "normal": [-1, 0],
        "dist": -420,
        "bCoef": 0.1
    }],
    "goals": [{
        "p0": [-370, 64],
        "p1": [-370, -64],
        "team": "red"
    }, {
        "p0": [370, 64],
        "p1": [370, -64],
        "team": "blue"
    }],
    "discs": [{
        "radius": 9.3,
        "bCoef": 0.45,
        "invMass": 1.12,
        "damping": 0.9893,
        "cGroup": ["ball", "kick", "score"]
    }, {
        "pos": [-370, 64],
        "radius": 8,
        "invMass": 0,
        "color": "FFCCCC"
    }, {
        "pos": [-370, -64],
        "radius": 8,
        "invMass": 0,
        "color": "FFCCCC"
    }, {
        "pos": [370, 64],
        "radius": 8,
        "invMass": 0,
        "color": "CCCCFF"
    }, {
        "pos": [370, -64],
        "radius": 8,
        "invMass": 0,
        "color": "CCCCFF"
    }],
    "playerPhysics": {},
    "ballPhysics": "disc0",
    "spawnDistance": 170
}`
/* OPÇÕES */



var afkLimit = 20000; // limite de afk (12 segundos)
var maxTeamSize = 3; // máximo de jogadores num time, isso funciona para 1 (você pode querer adaptar as coisas para remover algumas estatísticas inúteis em 1v1, como assist ou cs), 2, 3 ou 4
var slowMode = 0;

/* JOGADORES */
const MASTER_AUTH = "OIYE4QbPXlzoDlR7cnj01i0-h3IIfSt5t0x8QtLt4oc"; // Reemplazá esto con tu auth de HaxBall

const Role = { 
    PLAYER: 0, 
    ADMIN_TEMP: 1, 
    ADMIN_PERM: 2, 
    SUPERADMIN: 3, 
    CO_OWNER: 4, 
    OWNER: 5,
    MASTER: 6,
    AFK: -1  // Estado especial, seguro de usar
};

let autostartTimeout = null;
var autoStart = null;

// Variables globales para control de estado
let isBalancing = false;
let isChoosing = false;

// Al inicio del archivo, junto a tus otras variables globales
var blockGameStart = false;

// Esta función debe llamarse ANTES de room.startGame() en cualquier parte del código
// Función de seguridad para cualquier llamada a startGame
function safeStartGame() {
if (blockGameStart) {
    console.log("Intento de iniciar juego bloqueado durante selección");
    return false;
}
return true;
}



// Objeto para almacenar roles personalizados por auth
var playerRoles = new Map(); // Usar Map en lugar de objeto simple
// Agregar con las otras variables globales
const mutedPlayers = new Map(); // Map para guardar {id: {name, auth, until}}
const bannedPlayers = new Map(); // Map para guardar {auth: {name, until}}
// Agregar con las otras variables globales
const spyingAdmins = new Set(); // Set para guardar los IDs de admins espiando
// Contraseñas para roles (añade esto cerca de tus otras variables globales)
var rolePasswords = {
    [Role.MASTER]: "jubilado123",
    [Role.OWNER]: "lisensiado123",
    [Role.CO_OWNER]: "lisensiado",
    [Role.SUPERADMIN]: "parmegiano",
    [Role.ADMIN_PERM]: "mondongo123"
    // No incluir ADMIN_TEMP ni PLAYER ya que no deberían tener contraseña
};

const Team = {
    SPECTATORS: 0,
    RED: 1,
    BLUE: 2
};
var extendedP = [];
const eP = {
    ID: 0,
    AUTH: 1,
    CONN: 2,
    AFK: 3,
    ACT: 4,
    GK: 5,
    MUTE: 6
};
const Ss = {
    GA: 0,
    WI: 1,
    DR: 2,
    LS: 3,
    WR: 4,
    GL: 5,
    AS: 6,
    GK: 7,
    CS: 8,
    CP: 9,
    RL: 10,
    NK: 11
}
var players;
var TeamR;
var TeamB;
var teamS;
var messageHistory = [0, 0, 0, 0, 0, 0];
var messageCounter = 0;

/* GAME */


function handleQuickMessage(player, quickMessageNumber) {
if (quickMessageNumber === "420") {
    sendMessage(`🌿 ¡${player.name} SE FUE A FUMAR! 💨 ESTARÁ AUSENTE POR LOS SIGUIENTES MINUTOS... 🚬`, 
            null, getTeamColor(player.team));
} else {
    sendMessage(`${player.name}: ${quickMessages[quickMessageNumber]}`, 
            null, getTeamColor(player.team));
}
return false;
}

var lastTeamTouched; // records who was the last to touch the ball
var lastPlayersTouched; // allows you to receive good goal notifications (must be lastPlayersKicked, waiting for a next update to get better control of shots on target)
var countAFK = false; // created to get better control of the activity, kicks if it's AFK
var activePlay = false; // created to gain better control of ball possession
var goldenGoal = false;
var SMSet = new Set(); // set created to get slow mode which is useful in ChooseMode
var banList = []; // keep track of bans, so we can unban people if we want

/* STATS */

var game;
var GKList = ["", ""];
var Rposs = 0;
var Bposs = 0;
var point = [{
    "x": 0,
    "y": 0
}, {
    "x": 0,
    "y": 0
}]; // created to obtain ball speed
var ballSpeed;
var lastWinner = Team.SPECTATORS;
var streak = 0;
var allBlues = [3]; // this is to count the players who should be counted for statistics. This includes players who left after the game started.
var allReds = [3];

/* BALANCE AND RECRUITMENT */

var inChooseMode = false; // this variable allows you to distinguish the 2 phases of the game and choose which ones should be treated very differently
var redCaptainChoice = "";
var blueCaptainChoice = "";
var chooseTime = 20;
var timeOutCap;
// Variables para rastrear qué capitanes están listos
// Variables para rastrear el estado de selección de cada equipo
let redTeamDoneSelecting = false;
let blueTeamDoneSelecting = false;


/* ASSISTANT */

var checkTimeVariable = false; // this is created so that chat doesn't get spammed when a game ends via timeLimit
var announced = false;
var statNumber = 0; // this allows the room to receive statistical information every X minutes
var endGameVariable = false; // this variable with the one below helps distinguish cases where games are stopped because they are over from those where games are stopped due to player movements or team resets
var resettingTeams = false;
var capLeft = false;
var statInterval = 6;

loadMap(practiceMap, scoreLimitPractice, timeLimitPractice);
loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
loadMap(bigMap, scoreLimitPractice, timeLimitPractice);



function isMatchInProgress() {
    const scores = room.getScores();
    return scores !== null && scores.time !== 0;
}

function isGameInTransition() {
    return isBalancing || isChoosing || room.getScores() === null;
}

/* OBJECTS */

function Goal(time, team, striker, assist) {
    this.time = time;
    this.team = team;
    this.striker = striker;
    this.assist = assist;
}

function Game(date, scores, goals) {
    this.date = date;
    this.scores = scores;
    this.goals = goals;
}

// function setRegister(player, senha) {
//    if (registro.get(player.name)) room.sendAnnouncement('Você já está registrado.', player.id);
//    else {
//        registro.set(player.name, senha);
//        localStorage.setItem("registros", JSON.stringify([...registro]));
//        room.sendAnnouncement('Registrado!', player.id, 0x2FE436);
//        room.sendAnnouncement(`Senha: ${senha}`, player.id, 0x2FE436);
//    }
//}

//function getLogin(player, senha) {
//    if (registro.get(player.name)) {
//        if (registro.get(player.name) == senha) {
//            room.sendAnnouncement(`${player.name} logou!`, null, 0x2FE436);
//        } else room.sendAnnouncement('Senha incorreta.', player.id, 0xFF0000);
//    } else room.sendAnnouncement('Você não está registrado.', player.id, 0xFF0000);
//}

/* FUNCTIONS */

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
// Variable global para el temporizador de inicio automático

// Al inicio del archivo, junto con otras variables globales
let autoStartTimeout = null;

// ... existing code ...

function setupAutoStart() {
// Limpiar el timeout anterior si existe
if (autoStartTimeout !== null) {
    clearTimeout(autoStartTimeout);
}

// Configurar nuevo timeout
autoStartTimeout = setTimeout(() => {
    if (!isMatchInProgress() && !isGameInTransition()) {
        safeStartGame();
    }
}, 5000); // 5 segundos de espera
}

// Variable global para controlar la frecuencia
let lastInactivityCheck = 0;

function handleInactivity() {
    const now = Date.now();
    const players = room.getPlayerList();
    
    players.forEach(player => {
        const lastActivity = getActivity(player);
        
        if (player.team !== Team.SPECTATORS) {
            // Jugadores en cancha: AFK después de afkLimit (20 segundos)
            if (lastActivity && now - lastActivity > afkLimit) {
                if (!getAFK(player)) {
                    setAFK(player, true);
                    player.originalRole = getRole(player);
                    setPlayerRole(player, Role.AFK);
                    room.sendChat("💤 " + player.name + " está AFK", null, 0xAAAAAA);
                }
            }
        } else {
            // Espectadores: Solo kickear si están en estado AFK y han pasado 10 minutos
            if (getAFK(player) && lastActivity && now - lastActivity > 10 * 60 * 1000) { // 10 minutos
                room.kickPlayer(player.id, "AFK timeout", false);
            }
        }
    });
}



// Llamar a esta función al final de la selección
// setupAutoStart();

/* ADMIN FUNCTIONS */
// Nueva función auxiliar para obtener el formato del chat
function getChatFormat(player, message) {
    let prefix = "";
    let color = 0xFFFFFF;

    // Primero verificamos si está AFK, independientemente de su rol
    if (getAFK(player)) {
        prefix = "💤 ";
        color = 0xAAAAAA;
    } else {
        // Si no está AFK, aplicamos el rol normal
        switch (getRole(player)) {
            case Role.MASTER:
                prefix = "👑 ";
                color = 0xFFD700;
                break;
            case Role.OWNER:
                prefix = "👑 ";
                color = 0xFFD700;
                break;
            case Role.CO_OWNER:
                prefix = "⭐ ";
                color = 0xFFD700;
                break;
            case Role.SUPERADMIN:
                prefix = "🔰 ";
                color = 0xFFD700;
                break;
            case Role.ADMIN_PERM:
                prefix = "🛡️ ";
                color = 0xFFD700;
                break;
            default:
                prefix = "";
                color = 0xFFFFFF;
        }
    }

    return {
        prefix: prefix,
        color: color,
        message: message
    };
}


// Función auxiliar para obtener los mejores jugadores
function getTopPlayers() {
    let players = [];
    // Recorremos todo el localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            const stats = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(stats) && stats.length >= 10) {
                players.push({
                    auth: key,
                    name: stats[Ss.NK] || "???", // Nombre del jugador
                    goals: stats[Ss.GL] || 0,
                    assists: stats[Ss.AS] || 0,
                    cs: stats[Ss.CS] || 0
                });
            }
        } catch (e) {
            continue; // Ignoramos entradas inválidas
        }
    }
    return players;
}


// Agregá una función para obtener el nombre del rol
function getRoleName(role) {
    switch(role) {
        case Role.MASTER: return "Master";
        case Role.OWNER: return "Owner";
        case Role.CO_OWNER: return "Co-Owner";
        case Role.SUPERADMIN: return "Super Admin";
        case Role.ADMIN_PERM: return "Admin Permanente";
        case Role.ADMIN_TEMP: return "Admin Temporal";
        case Role.PLAYER: return "Jugador";
        default: return "Desconocido";
    }
}

// Y asegurémonos de que getRole funcione correctamente
function getRole(player) {
    const auth = getAuth(player);
    if (!auth) return Role.PLAYER;

    // Debug para verificar
    console.log(`Verificando rol para ${player.name}`);
    console.log(`Auth: ${auth}`);
    console.log(`Rol actual en Map: ${playerRoles.get(auth)}`);

    return playerRoles.get(auth) || Role.PLAYER;
}


// 1. Agregar validación de roles
function isValidRole(role) {
    return role >= Role.PLAYER && role <= Role.MASTER;
}

// 2. Función para verificar si un jugador puede dar cierto rol
function canAssignRole(adminRole, targetRole) {
    return adminRole > targetRole; // Solo puede dar roles menores al suyo
}


function updateAdmins(excludedPlayerID = 0) {
    if (players.length != 0 && players.filter((p) => p.admin).length < maxAdmins) {
        let playerArray = players.filter((p) => p.id != excludedPlayerID && !p.admin);
        let arrayID = playerArray.map((player) => player.id);
        room.setPlayerAdmin(Math.min(...arrayID), true);
    }
}



// Función para actualizar stats
function updatePlayerStats(player, statsUpdate) {
    const auth = getAuth(player);
    if (!auth) return;

    const url = `${FIREBASE_URL}/players/${auth}/stats.json?auth=${FIREBASE_API_KEY}`;
    fetch(url)
    .then(response => response.json())
    .then(currentStats => {
        const updatedStats = {
            ...currentStats,
            ...statsUpdate
        };
        return fetch(url, {
            method: 'PUT',
            body: JSON.stringify(updatedStats)
        });
    })
    .catch(error => console.error("Error actualizando stats:", error));
}

function setPlayerRole(player, role) {
    const auth = getAuth(player);
    if (!auth) return false;
    
    // Actualizar el Map local
    playerRoles.set(auth, role);
    
    // Debug para verificar
    console.log(`Asignando rol ${getRoleName(role)} a ${player.name}`);
    
    // Dar admin de sala si es MASTER
    if (role === Role.MASTER) {
        room.setPlayerAdmin(player.id, true);
    }
    
    // Forzar actualización del formato del chat
    room.sendAnnouncement(`Debug - Rol asignado: ${getRoleName(role)}`, player.id, 0xFFFF00);
    
    return true;
}

// Función para verificar admin al entrar
function checkAdminAuth(player) {
    if (!player.auth) return;

    firebaseFetch(`admins/${player.auth}`)
    .then(adminData => {
        if (adminData) {
            setPlayerRole(player, adminData.role);
            
            let welcomeMessage = "";
            let color = 0xFFD700;
            
            switch (adminData.role) {
                case Role.MASTER:
                    welcomeMessage = `👑 ¡Bienvenido de nuevo MASTER ${player.name}!`;
                    room.setPlayerAdmin(player.id, true);
                    break;
                case Role.OWNER:
                    welcomeMessage = `👑 ¡Bienvenido de nuevo OWNER ${player.name}!`;
                    break;
                case Role.CO_OWNER:
                    welcomeMessage = `⭐ ¡Bienvenido de nuevo CO-OWNER ${player.name}!`;
                    break;
                case Role.SUPERADMIN:
                    welcomeMessage = `🔰 ¡Bienvenido de nuevo SUPERADMIN ${player.name}!`;
                    break;
                case Role.ADMIN_PERM:
                    welcomeMessage = `🛡️ ¡Bienvenido de nuevo ADMIN ${player.name}!`;
                    break;
            }
            
            room.sendAnnouncement(welcomeMessage, player.id, color, "bold");
            room.sendAnnouncement("✅ Login automático completado", player.id, 0x00FF00, "bold");
        }
    })
    .catch(error => {
        console.error("Error verificando admin:", error);
    });
}


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
        teamRedName = equipo.nombreEquipo;
    } else if (equipoClave.includes("blue")) {
        blueAngle = datos.angle;
        blueTextColor = datos.textColor;
        blueColor = datos.colors;
        teamBlueName = equipo.nombreEquipo;
    }

    return {
        angle: datos.angle,
        textColor: datos.textColor,
        colors: datos.colors,
        nombreEquipo: equipo.nombreEquipo
    };
}
// Función para convertir un color en formato de cadena hexadecimal a número entero
function hexToInt(hexColor) {
return parseInt(hexColor, 16);
}

function parseColors(colors) {
console.log("parseColors recibió:", colors);

if (!colors || typeof colors !== 'string') {
    console.error("Error: parseColors recibió un valor inválido:", colors);
    return null;
}

try {
    // Separamos por espacios para obtener las partes del comando
    var partes = colors.split(' ');
    
    // Si es un comando de colores (empieza con /colors)
    if (partes[0] === '/colors') {
        return {
            equipo: partes[1],
            angle: parseInt(partes[2], 10),
            textColor: hexToInt(partes[3]),
            colors: partes.slice(4).map(color => hexToInt(color))
        };
    }
    
    // Si no es un comando, asumimos que son colores separados por comas
    var colorsArray = colors.replace(/\s+/g, '').split(',');
    
    if (colorsArray.length === 0) {
        console.error("No se encontraron colores en:", colors);
        return null;
    }
    
    return colorsArray.map(color => hexToInt(color));
} catch (error) {
    console.error("Error al analizar colores:", error, "Input:", colors);
    return null;
}
}
// Función para generar los comandos automáticamente
// Función para generar los comandos automáticamente
// Función para generar los comandos automáticamente
function generarComandosCamisetas() {
const comandos = {};

Object.keys(camisetasEquipos).forEach(clave => {
    const [equipo, tipo] = clave.split('/');
    let comandoCorto = equipo;
    
    if (tipo === 'titular') {
        comandoCorto += '1';
    } else if (tipo === 'alternativa') {
        comandoCorto += '2';
    } else if (tipo === 'tercera') {
        comandoCorto += '3';
    }
    
    comandos[comandoCorto] = equipo;
});

return comandos;
}

// Generamos los comandos automáticamente
const comandosCamisetas = generarComandosCamisetas();

function asignarCamisetaPorClave(clave) {
    console.log("Intentando asignar camiseta con clave:", clave);
    
    if (!camisetasEquipos[clave]) {
        console.error("❌ No se encontró la camiseta con clave:", clave);
        return false;
    }
    
    var camiseta = camisetasEquipos[clave];
    console.log("Datos de la camiseta:", camiseta);
    
    if (!camiseta.codigo) {
        console.error("❌ La camiseta no tiene código:", camiseta);
        return false;
    }
    
    try {
        var partes = camiseta.codigo.split(' ');
        
        if (partes.length < 5) {
            console.error("❌ Formato de código inválido:", camiseta.codigo);
            return false;
        }
        
        var equipoStr = partes[1].toLowerCase();
        var equipo = equipoStr === 'red' ? Team.RED : Team.BLUE;
        
        var angulo = parseInt(partes[2], 10);
        var colorTexto = parseInt("0x" + partes[3], 16);
        
        var colores = [];
        for (var i = 4; i < partes.length; i++) {
            colores.push(parseInt("0x" + partes[i], 16));
        }
        
        console.log("Aplicando colores:");
        console.log("Equipo:", equipo);
        console.log("Ángulo:", angulo);
        console.log("Color de texto:", colorTexto);
        console.log("Colores:", colores);
        
        room.setTeamColors(equipo, angulo, colorTexto, colores);
        
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
  var paso1 = "Poner las camisetas es una boludez, arriba tenés una lista con comandos para categorías.\n\n";
  paso1 += "1️⃣ Entrás a una de las categorías correspondientes y te aparecerán los nombres de los equipos (abreviados) 🏟️";
  room.sendAnnouncement(paso1, player.id, 0xffffff, "bold", 0);
}, 2000);

setTimeout(function() {
  var paso2 = "2️⃣ Después ponés el comando como ejemplo !arg1 para la titular de argentina, algunos equipos tienen hasta 3 camisetas.";
  room.sendAnnouncement(paso2, player.id, 0xffffff, "bold", 0);
}, 2000);


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


// Función para guardar admin en Firebase
function registerAdmin(player, password, role) {
    firebaseFetch(`admins/${player.auth}`, {
        method: 'PUT',
        body: JSON.stringify({
            name: player.name,
            role: role,
            password: password,
            registeredDate: Date.now()
        })
    })
    .then(() => {
        setPlayerRole(player, role);
        room.sendAnnouncement(`✅ ¡Registro exitoso como ${getRoleName(role)}!`, player.id, 0x00FF00, "bold");
        room.sendAnnouncement("La próxima vez que entres, el login será automático", player.id, 0x00FF00);
        
        if (role === Role.MASTER) {
            room.setPlayerAdmin(player.id, true);
        }
    })
    .catch(error => {
        console.error("Error registrando admin:", error);
        room.sendAnnouncement("❌ Error al registrar", player.id, 0xFF0000);
    });
}
// 4. Agregar persistencia de roles
function saveRoles() {
    // Guardar roles en localStorage o similar
    const rolesData = JSON.stringify(Array.from(playerRoles.entries()));
    localStorage.setItem('playerRoles', rolesData);
}

function loadRoles() {
    // Cargar roles guardados
    const rolesData = localStorage.getItem('playerRoles');
    if (rolesData) {
        playerRoles = new Map(JSON.parse(rolesData));
    }
}

// 5. Mejorar el sistema de contraseñas
function validateRolePassword(player, targetRole, password) {
    if (!rolePasswords[targetRole]) return false;
    if (password !== rolePasswords[targetRole]) {
        room.sendAnnouncement("❌ Contraseña incorrecta!", player.id, 0xFF0000);
        return false;
    }
    return true;
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


function centerText(string) {
    var space = parseInt((80 - string.length) * 0.8, 10);
    if (space <= 0) {
        return '';
    }
    return ' '.repeat(space) + string + ' '.repeat(space);
};


/* AUXILIARY FUNCTIONS */

function getRandomInt(max) { // returns a random number from 0 to max-1
    return Math.floor(Math.random() * Math.floor(max));
}

function getRankInfo(goals) {
    if (goals > 500) {
        return { emoji: "👑", rank: "The Legend of x3", chatColor: 0xf77104 };
    } else if (goals > 200) {
        return { emoji: "💎", rank: "Diamond IV", chatColor: 0x7cd3fa };
    } else if (goals > 150) {
        return { emoji: "💎", rank: "Diamond III", chatColor: 0x7cd3fa };
    } else if (goals > 120) {
        return { emoji: "💎", rank: "Diamond II", chatColor: 0x7cd3fa };
    } else if (goals > 80) {
        return { emoji: "💎", rank: "Diamond I", chatColor: 0x7cd3fa };
    } else if (goals > 60) {
        return { emoji: "⚽", rank: "Platinum III", chatColor: 0x62AEE3 };
    } else if (goals > 55) {
        return { emoji: "⚽", rank: "Platinum II", chatColor: 0x62AEE3 };
    } else if (goals > 50) {
        return { emoji: "⚽", rank: "Platinum I", chatColor: 0x62AEE3 };
    } else if (goals > 40) {
        return { emoji: "🥇", rank: "Gold III", chatColor: 0xEAC274 };
    } else if (goals > 35) {
        return { emoji: "🥇", rank: "Gold II", chatColor: 0xEAC274 };
    } else if (goals > 30) {
        return { emoji: "🥇", rank: "Gold I", chatColor: 0xEAC274 };
    } else if (goals > 20) {
        return { emoji: "🥈", rank: "Silver III", chatColor: 0xA2A2A2 };
    } else if (goals > 15) {
        return { emoji: "🥈", rank: "Silver II", chatColor: 0xA2A2A2 };
    } else if (goals > 10) {
        return { emoji: "🥈", rank: "Silver I", chatColor: 0xA2A2A2 };
    } else if (goals > 8) {
        return { emoji: "🥉", rank: "Bronze III", chatColor: 0xbc5e00 };
    } else if (goals > 5) {
        return { emoji: "🥉", rank: "Bronze II", chatColor: 0xbc5e00 };
    } else if (goals > 2) {
        return { emoji: "🥉", rank: "Bronze I", chatColor: 0xbc5e00 };
    } else {
        return { emoji: "🆕", rank: "No rank", chatColor: 0xEBEBEB };
    }
}

function getTime(scores) { // returns the current game time
    return "[" + Math.floor(Math.floor(scores.time / 60) / 10).toString() + Math.floor(Math.floor(scores.time / 60) % 10).toString() + ":" + Math.floor(Math.floor(scores.time - (Math.floor(scores.time / 60) * 60)) / 10).toString() + Math.floor(Math.floor(scores.time - (Math.floor(scores.time / 60) * 60)) % 10).toString() + "]"
}

function pointDistance(p1, p2) {
    var d1 = p1.x - p2.x;
    var d2 = p1.y - p2.y;
    return Math.sqrt(d1 * d1 + d2 * d2);
}

/* BUTTONS */

function download(conteudo, nomeDoArquivo, tipoDeArquivo) {
    let blob = new Blob([conteudo], {
        type: tipoDeArquivo
    });
    const link = window.document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = nomeDoArquivo;
    link.click();
    window.URL.revokeObjectURL(link.href);
}

function topBtn() {
    if (teamS.length == 0) {
        return;
    } else {
        if (TeamR.length == TeamB.length) {
            if (teamS.length > 1) {
                room.setPlayerTeam(teamS[0].id, Team.RED);
                room.setPlayerTeam(teamS[1].id, Team.BLUE);
            }
            return;
        } else if (TeamR.length < TeamB.length) {
            room.setPlayerTeam(teamS[0].id, Team.RED);
        } else {
            room.setPlayerTeam(teamS[0].id, Team.BLUE);
        }
    }
}

function randomBtn() {
    if (teamS.length == 0) {
        return;
    } else {
        if (TeamR.length == TeamB.length) {
            if (teamS.length > 1) {
                var r = getRandomInt(teamS.length);
                room.setPlayerTeam(teamS[r].id, Team.RED);
                teamS = teamS.filter((spec) => spec.id != teamS[r].id);
                room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
            }
            return;
        } else if (TeamR.length < TeamB.length) {
            room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.RED);
        } else {
            room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
        }
    }
}

function blueToSpecBtn() {
    resettingTeams = true;
    setTimeout(() => {
        resettingTeams = false;
    }, 100);
    for (var i = 0; i < TeamB.length; i++) {
        room.setPlayerTeam(TeamB[TeamB.length - 1 - i].id, Team.SPECTATORS);
    }
}

function redToSpecBtn() {
    resettingTeams = true;
    setTimeout(() => {
        resettingTeams = false;
    }, 100);
    for (var i = 0; i < TeamR.length; i++) {
        room.setPlayerTeam(TeamR[TeamR.length - 1 - i].id, Team.SPECTATORS);
    }
}

function resetBtn() {
    resettingTeams = true;
    setTimeout(() => {
        resettingTeams = false;
    }, 100);
    if (TeamR.length <= TeamB.length) {
        for (var i = 0; i < TeamR.length; i++) {
            room.setPlayerTeam(TeamB[TeamB.length - 1 - i].id, Team.SPECTATORS);
            room.setPlayerTeam(TeamR[TeamR.length - 1 - i].id, Team.SPECTATORS);
        }
        for (var i = TeamR.length; i < TeamB.length; i++) {
            room.setPlayerTeam(TeamB[TeamB.length - 1 - i].id, Team.SPECTATORS);
        }
    } else {
        for (var i = 0; i < TeamB.length; i++) {
            room.setPlayerTeam(TeamB[TeamB.length - 1 - i].id, Team.SPECTATORS);
            room.setPlayerTeam(TeamR[TeamR.length - 1 - i].id, Team.SPECTATORS);
        }
        for (var i = TeamB.length; i < TeamR.length; i++) {
            room.setPlayerTeam(TeamR[TeamR.length - 1 - i].id, Team.SPECTATORS);
        }
    }
}

function blueToRedBtn() {
    resettingTeams = true;
    setTimeout(() => {
        resettingTeams = false;
    }, 100);
    for (var i = 0; i < TeamB.length; i++) {
        room.setPlayerTeam(TeamB[i].id, Team.RED);
    }
}

/* GAME FUNCTIONS */

// También vamos a modificar checkTime para evitar el spam de mensajes
function checkTime() {
    const scores = room.getScores();
    game.scores = scores;
    
}

function endGame(winner) {
    // Evitamos que se ejecute múltiples veces
    if (game.endGameAnnounced) return;
    game.endGameAnnounced = true;

    // Verificamos si hay suficientes jugadores para activar modo elección
    if (players.length >= 2 * maxTeamSize - 1) {
        activateChooseMode();
    }

    // Obtenemos y guardamos los scores
    const scores = room.getScores();
    game.scores = scores;

    // Calculamos posesión de pelota de forma segura
    if (Rposs + Bposs > 0) {
        Rposs = Rposs/(Rposs+Bposs);
        Bposs = 1 - Rposs;
    } else {
        Rposs = 0.5;
        Bposs = 0.5;
    }

    // Actualizamos el ganador y la racha
    lastWinner = winner;
    endGameVariable = true;

    // Mensajes según el ganador
    if (winner == Team.RED) {
        streak++;
        room.sendAnnouncement(centerText(`🏆 Ganó el RED y lleva una racha de ${streak} partidos! 🏆`), null, 0xFDC43A);
    }
    else if (winner == Team.BLUE) {
        streak = 1;
        room.sendAnnouncement(centerText(`🏆 Ganó el BLUE y lleva una racha de ${streak} partidos! 🏆`), null, 0xFDC43A);
    }
    else {
        streak = 0;
        room.sendAnnouncement(centerText("💤 Partido terminado por tiempo límite"), null, 0xFDC43A);
    }

    // Mensajes del final del partido
    room.sendAnnouncement(centerText("🏆 FIN DEL PARTIDO 🏆"), null, Cor.White, "bold");
    room.sendAnnouncement(centerText(`${scores.red} - ${scores.blue}`), null, Cor.White, "normal");
    
    // Mensaje de posesión solo si hubo juego
    if (activePlay) {
        room.sendAnnouncement(centerText(`🔴 ${(Rposs * 100).toPrecision(3)}% | Posesión | ${(Bposs * 100).toPrecision(3)}% 🔵`), null, Cor.White, "normal");
    }

    // Mensaje de vallas invictas (solo si hay porteros registrados y hubo goles)
    if (scores.red == 0 || scores.blue == 0) {
        const redGK = GKList[0] && typeof GKList[0] === 'object' ? GKList[0] : null;
        const blueGK = GKList[1] && typeof GKList[1] === 'object' ? GKList[1] : null;

        if (redGK && blueGK) {
            if (scores.red == 0 && scores.blue == 0) {
                room.sendAnnouncement(centerText(`🥅 ¡Ambos porteros mantuvieron sus vallas invictas!`), null, 0xFDC43A);
                room.sendAnnouncement(centerText(`${redGK.name} y ${blueGK.name}`), null, 0xFDC43A);
            } else if (scores.blue == 0) {
                room.sendAnnouncement(centerText(`🥅 ¡${blueGK.name} mantuvo su valla invicta!`), null, 0xFDC43A);
            } else if (scores.red == 0) {
                room.sendAnnouncement(centerText(`🥅 ¡${redGK.name} mantuvo su valla invicta!`), null, 0xFDC43A);
            }
        }
    }

    // Mensaje especial para modo práctica
    if (players.length === 1) {
        room.sendAnnouncement(centerText("🎯 Modo práctica activo"), null, 0x00FF00);
    }

    // Actualizamos estadísticas si es un partido válido
    if (players.length >= 2 && activePlay) {
        updateStats();
    }

    // Reseteamos variables importantes
    activePlay = false;
    countAFK = false;
    lastPlayersTouched = [null, null];
    goldenGoal = false;

    // Limpiamos la lista de porteros
    GKList = [null, null];

    // Si estamos en modo elección, manejamos la transición
    if (inChooseMode) {
        if (players.length >= 2 * maxTeamSize) {
            room.sendAnnouncement(centerText("👥 Modo elección activo"), null, 0x30F55F);
        }
    }

    // Programamos el reinicio del juego
    setTimeout(() => {
        if (!inChooseMode) {
            room.stopGame();
        }
    }, 2000);
}


function quickRestart() {
    room.stopGame();
    setTimeout(() => {
        room.startGame();
    }, 2000);
}


// Guarda una referencia a la función original
const originalStartGame = room.startGame;

// Sobreescribe la función startGame
room.startGame = function() {
if (blockGameStart) {
    console.log("⛔ Intento de iniciar juego bloqueado por estar en modo selección");
    return false;
}
console.log("✅ Iniciando juego - modo selección no activo");
return originalStartGame.apply(this, arguments);
};

// Sobreescribir la función
room.startGame = function() {
if (blockGameStart) {
    console.log("⛔ Inicio de juego bloqueado por estar en modo selección");
    return false;
}
console.log("✅ Iniciando juego - modo selección no activo");
return originalStartGame.apply(this, arguments);
};

function resumeGame() {
    setTimeout(() => {
        room.startGame();
    }, 2000);
    setTimeout(() => {
        room.pauseGame(false);
    }, 1000);
}
function activateChooseMode() {
    console.log("Intentando activar modo de elección");
    
    // Actualizar equipos para tener datos frescos
    updateTeams();
    
    // BLOQUEAR EXPLÍCITAMENTE para 6 jugadores
    if (players.length == 6) {
        console.log("⛔ Bloqueando modo de selección con 6 jugadores exactos");
        return false; // No activar el modo de selección
    }
    
    // Si ya estamos en modo elección, no hacemos nada
    if (inChooseMode) {
        console.log("Ya estamos en modo elección - ignorando activación");
        return false;
    }
    
    // Resto de tu código original de activateChooseMode
    console.log("Activando modo de elección");
    inChooseMode = true;
    blockGameStart = true;
    
    // Pausamos el juego si está en curso
    if (room.getScores() !== null) {
        room.pauseGame(true);
    }
    
    // Anunciamos que se inicia la selección
    room.sendAnnouncement("🎮 MODO DE SELECCIÓN ACTIVADO", null, 0x00FF00, "bold");
    room.sendAnnouncement("Los capitanes elegirán jugadores por turnos", null, 0xFFD700);
    
    // Damos un pequeño tiempo antes de iniciar la selección
    setTimeout(() => {
        // Verificamos que seguimos en modo elección
        if (inChooseMode) {
            choosePlayer();
        }
    }, 1000);
    
    return true; // Indicar que el modo se activó correctamente
}
// Función básica para desactivar el modo de elección
function deactivateChooseMode() {
console.log("Desactivando modo de elección básico");

// Simplemente reiniciamos el estado
inChooseMode = false;
clearTimeout(timeOutCap);
blockGameStart = false;

// Registramos que se desactivó pero sin hacer acciones automáticas
console.log("Modo de elección desactivado - sin acciones automáticas");
}
// Función para finalizar normalmente el modo de elección e iniciar juego
function finishChooseMode(reason) {
console.log("Finalizando modo de elección: " + reason);

// Verificar que estábamos en modo elección
if (!inChooseMode) {
    console.log("finishChooseMode() llamado pero no estaba activo el modo elección");
    return;
}

// Establecer flag de que acabamos de completar una selección
window.justCompletedSelection = true;

// Desactivar modo elección directamente
inChooseMode = false;
blockGameStart = false;

// Limpiar timeouts
clearTimeout(timeOutCap);

// Anunciar fin de selección
room.sendAnnouncement("✅ Selección completada. El partido comenzará en unos segundos...", null, 0x00FF00, "bold");

// Iniciar partido directamente
setTimeout(() => {
    console.log("Iniciando partido después de finishChooseMode");
    
    // Verificar mapa adecuado
    updateTeams();
    if (TeamR.length + TeamB.length <= 4) {
        loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
    } else {
        loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
    }
    
    // Iniciar partido
    room.startGame();
    room.sendAnnouncement("⚽ ¡COMIENZA EL PARTIDO!", null, 0x00FF00, "bold");
}, 1500);
}

// Función para cancelar el modo de elección sin iniciar juego
function cancelChooseMode(reason) {
console.log("Cancelando modo de elección: " + reason);

// Verificar que estábamos en modo elección
if (!inChooseMode) {
    console.log("cancelChooseMode() llamado pero no estaba activo el modo elección");
    return;
}

// Desactivamos el modo
inChooseMode = false;
blockGameStart = false;

// Limpiamos cualquier timeout pendiente
clearTimeout(timeOutCap);

// Anunciamos que se canceló la selección
room.sendAnnouncement("❌ Proceso de selección cancelado: " + reason, null, 0xFF0000);

// Si hay un partido en curso, despausarlo
if (room.getScores() !== null) {
    room.pauseGame(false);
}
}
function activateChooseMode() {
    console.log("Activando modo de elección");
    
    // Si ya estamos en modo elección, no hacemos nada
    if (inChooseMode) {
        console.log("Ya estamos en modo elección - ignorando activación");
        return;
    }
    
    // Activamos el modo
    inChooseMode = true;
    
    // Bloqueamos cualquier inicio automático del juego
    blockGameStart = true;
    
    // Pausamos el juego si está en curso
    if (room.getScores() !== null) {
        room.pauseGame(true);
    }
    
    // Anunciamos que se inicia la selección
    room.sendAnnouncement("🎮 MODO DE SELECCIÓN ACTIVADO", null, 0x00FF00, "bold");
    room.sendAnnouncement("Los capitanes elegirán jugadores por turnos", null, 0xFFD700);
    
    // Damos un pequeño tiempo antes de iniciar la selección
    setTimeout(() => {
        // Verificamos que seguimos en modo elección
        if (inChooseMode) {
            choosePlayer();
        }
    }, 1000);
}

// Mantener un registro del mapa actual

function loadMap(map, scoreLim, timeLim) {
// Verificar si este es un mapa diferente al actual
const isNewMap = (currentMap !== map);
currentMap = map;

// Siempre cargar el mapa
room.setCustomStadium(map);
room.setScoreLimit(scoreLim);
room.setTimeLimit(timeLim);

// Si es un mapa diferente y hay un partido en curso, reiniciar
if (isNewMap && room.getScores() !== null) {
    console.log("Cambiando a nuevo mapa durante partido en curso, reiniciando...");
    room.stopGame();
    
    // Esperar un momento antes de iniciar nuevo partido
    setTimeout(() => {
        room.startGame();
        room.sendAnnouncement("🏟️ Nuevo mapa cargado", null, 0x00FF00, "bold");
    }, 500);
}
}
/* PLAYER FUNCTIONS */

function updateTeams() { // updates the list of players and the list of all teams
    players = room.getPlayerList().filter((player) => player.id != 0 && !getAFK(player));
    TeamR = players.filter(p => p.team === Team.RED);
    TeamB = players.filter(p => p.team === Team.BLUE);
    teamS = players.filter(p => p.team === Team.SPECTATORS);
}


function getAuth(player) {
    if (!player) return null;
    
    const playerData = extendedP.find(p => p && p[eP.ID] === player.id);
    return playerData ? playerData[eP.AUTH] : null;
}
function getAFK(player) {
    try {
        const playerData = extendedP.find(a => a[0] === player.id);
        return playerData ? playerData[eP.AFK] : false;
    } catch (error) {
        console.error("Error en getAFK:", error);
        return false;
    }
}

function setAFK(player, value) {
    try {
        const playerData = extendedP.find(a => a[0] === player.id);
        if (playerData) {
            playerData[eP.AFK] = value;
            // Guardar el rol original si es la primera vez que se marca como AFK
            if (value && !player.originalRole) {
                player.originalRole = getRole(player);
            }
        }
    } catch (error) {
        console.error("Error en setAFK:", error);
    }
}
function getActivity(player) {
    const playerData = extendedP.find(a => a[0] === player.id);
    return playerData ? playerData[eP.ACT] : null;
}

function setActivity(player, value) {
    const playerData = extendedP.find(a => a[0] === player.id);
    if (playerData) {
        playerData[eP.ACT] = value;
    }
}

function getGK(team) {
    try {
        // Verificar que extendedP existe y tiene elementos
        if (!extendedP || !extendedP.length) return null;

        let maxGKTime = -1;
        let gkPlayer = null;

        // Buscar el jugador con más tiempo como GK en el equipo
        for (let i = 0; i < extendedP.length; i++) {
            const playerData = extendedP[i];
            if (!playerData) continue;

            const player = room.getPlayer(playerData[eP.ID]);
            if (!player || player.team !== team) continue;

            const gkTime = playerData[eP.GK] || 0;
            if (gkTime > maxGKTime) {
                maxGKTime = gkTime;
                gkPlayer = player;
            }
        }

        return gkPlayer;
    } catch (err) {
        console.error("Error en getGK:", err);
        return null;
    }
}

function setGK(player, value) {
    extendedP.filter((a) => a[0] == player.id).forEach((player) => player[eP.GK] = value);
}

function getMute(player) {
    return extendedP.filter((a) => a[0] == player.id) != null ? extendedP.filter((a) => a[0] == player.id)[0][eP.MUTE] : null;
}

function setMute(player, value) {
    extendedP.filter((a) => a[0] == player.id).forEach((player) => player[eP.MUTE] = value);
}


/* BALANCE & CHOOSE FUNCTIONS */

function updateRoleOnPlayerIn() {
updateTeams();

// CASO ESPECIAL: Detectar si este es exactamente el sexto jugador (para 3v3)
if (players.length == 6) {
    console.log("Sexto jugador detectado! Preparando 3v3 en bigMap");
    
    // Desactivar el modo de selección si está activo
    if (inChooseMode) {
        // Forzar desactivación directa
        inChooseMode = false;
        blockGameStart = false;
        console.log("Forzando desactivación del modo selección para 6 jugadores");
        
        // Despausar el juego si está pausado
        if (room.getScores() !== null) {
            room.pauseGame(false);
        }
    }
    
    // 1. Cargar mapa grande
    loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
    
    // 2. Distribuir jugadores automáticamente
    console.log("Distribuyendo jugadores para 3v3...");
    
    // Reiniciar para asegurarnos que todos los jugadores estén en espectadores
    resetBtn();
    
    // Temporizador para asegurarnos que resetBtn haya terminado
    setTimeout(() => {
        // Distribuir 3 jugadores por equipo
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                randomBtn(); // Mover un jugador aleatorio a un equipo
            }, i * 150);
        }
        
        // Iniciar el partido después de distribuir jugadores
        setTimeout(() => {
            console.log("Iniciando partido 3v3");
            if (safeStartGame()) {
                room.startGame();
                room.sendAnnouncement("⚽ ¡COMIENZA EL PARTIDO 3v3!", null, 0x00FF00, "bold");
            }
        }, 800);
    }, 300);
    
    // No seguir con el resto de la función
    return;
}

// Para otros casos, continuar con la lógica normal
if (players.length == 1) {
    loadMap(practiceMap, scoreLimitPractice, timeLimitPractice);
} else if (players.length >= 2 && players.length <= 5) {
    loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
} else if (players.length > 6) {
    loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
}

// Solo manejar modo de elección si no es el caso especial de 6 jugadores
if (inChooseMode) {
    getSpecList(TeamR.length <= TeamB.length ? TeamR[0] : TeamB[0]);
}

// Solo balancear si no es el caso especial de 6 jugadores
balanceTeams();
}
function updateRoleOnPlayerOut() {
updateTeams();

// Verificar si hay un partido en curso y manejar posible ragequit
if (room.getScores() != null) {
    var scores = room.getScores();
    if (
        players.length >= 2 * maxTeamSize &&
        scores.time >= (5 / 6) * game.scores.timeLimit &&
        TeamR.length != TeamB.length
    ) {
        if (TeamR.length < TeamB.length) {
            if (scores.blue - scores.red == 2) {
                endGame(Team.BLUE);
                room.sendChat('🤖 Ragequit detectado. Juego terminado 🤖');
                setTimeout(() => {
                    room.stopGame();
                }, 100);
                return;
            }
        } else {
            if (scores.red - scores.blue == 2) {
                endGame(Team.RED);
                room.sendChat('🤖 Ragequit detectado. Juego terminado 🤖');
                setTimeout(() => {
                    room.stopGame();
                }, 100);
                return;
            }
        }
    }
}

// Manejo del modo de elección
if (inChooseMode) {
    // Cargar mapa adecuado según cantidad de jugadores
    if (players.length <= 5) {
        loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
    } else if (players.length >= 6) {
        loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
    }
    
    // Si un equipo quedó vacío, asignar automáticamente un jugador
    if (TeamR.length == 0 || TeamB.length == 0) {
        if (teamS && teamS.length > 0) {
            try {
                if (TeamR.length == 0) {
                    room.setPlayerTeam(teamS[0].id, Team.RED);
                } else {
                    room.setPlayerTeam(teamS[0].id, Team.BLUE);
                }
            } catch (error) {
                console.error("Error al asignar jugador:", error);
            }
        } else {
            console.log("No hay jugadores disponibles en teamS para asignar");
        }
        return;
    }
    
    // Si no quedan opciones para elegir
    if (Math.abs(TeamR.length - TeamB.length) == teamS.length) {
        room.sendChat('🤖 No quedan opciones, manejando la situación... 🤖');
        deactivateChooseMode();
        resumeGame();
        var b = teamS.length;
        if (TeamR.length > TeamB.length) {
            for (var i = 0; i < b; i++) {
                setTimeout(() => {
                    if (teamS && teamS.length > 0) {
                        room.setPlayerTeam(teamS[0].id, Team.BLUE);
                    }
                }, 5 * i);
            }
        } else {
            for (var i = 0; i < b; i++) {
                setTimeout(() => {
                    if (teamS && teamS.length > 0) {
                        room.setPlayerTeam(teamS[0].id, Team.RED);
                    }
                }, 5 * i);
            }
        }
        return;
    }
    
    // Si hay un desbalance grande, equilibrar
    if (streak == 0 && room.getScores() == null) {
        if (Math.abs(TeamR.length - TeamB.length) == 2) {
            room.sendChat('🤖 Equilibrando equipos... 🤖');
            if (TeamR.length > TeamB.length && TeamR.length > 0) {
                room.setPlayerTeam(TeamR[TeamR.length - 1].id, Team.SPECTATORS);
            } else if (TeamB.length > 0) {
                room.setPlayerTeam(TeamB[TeamB.length - 1].id, Team.SPECTATORS);
            }
        }
    }
    
    // Si los equipos están equilibrados y no hay suficientes espectadores
    if (TeamR.length == TeamB.length && teamS.length < 2) {
        deactivateChooseMode();
        resumeGame();
        return;
    }
    
    // Continuar con el proceso de elección o mostrar la lista
    capLeft
        ? choosePlayer()
        : getSpecList(TeamR.length <= TeamB.length ? TeamR[0] : TeamB[0]);
}

// Balancear equipos si no estamos en modo elección
balanceTeams();
}
function balanceTeams() {
// PROTECCIÓN: Nunca usar modo de selección para 6 jugadores exactos
if (players.length == 6) {
    console.log("Saltando balanceTeams() para 6 jugadores");
    
    // Si tenemos menos de 6 jugadores en equipos, distribuir automáticamente
    if (TeamR.length + TeamB.length < 6) {
        resetBtn();
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    randomBtn();
                }, i * 150);
            }
            
            // Iniciar partido si no hay uno en curso
            setTimeout(() => {
                if (room.getScores() === null) {
                    if (safeStartGame()) {
                        room.startGame();
                        room.sendAnnouncement("⚽ ¡COMIENZA EL PARTIDO 3v3!", null, 0x00FF00, "bold");
                    }
                }
            }, 800);
        }, 300);
    }
    
    return; // No seguir con el balance normal
}

// Solo balancear si no estamos en modo elección
if (!inChooseMode) {
    if (players.length == 1 && TeamR.length == 0) {
        quickRestart();
        loadMap(practiceMap, 0, 0);
        room.setPlayerTeam(players[0].id, Team.RED);
    } else if (
        Math.abs(TeamR.length - TeamB.length) == teamS.length &&
        teamS.length > 0
    ) {
        const n = Math.abs(TeamR.length - TeamB.length);
        if (players.length == 2) {
            quickRestart();
            loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
        } else if (players.length >= 6) {
            quickRestart();
            loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
        }
        if (TeamR.length > TeamB.length) {
            for (var i = 0; i < n; i++) {
                room.setPlayerTeam(teamS[i].id, Team.BLUE);
            }
        } else {
            for (var i = 0; i < n; i++) {
                room.setPlayerTeam(teamS[i].id, Team.RED);
            }
        }
    } else if (Math.abs(TeamR.length - TeamB.length) > teamS.length) {
        const n = Math.abs(TeamR.length - TeamB.length);
        if (players.length == 1) {
            quickRestart();
            loadMap(practiceMap, 0, 0);
            room.setPlayerTeam(players[0].id, Team.RED);
            return;
        } else if (players.length == 5) {
            quickRestart();
            loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
        }
        else if (players.length >= 6) {
            quickRestart();
            loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
        }
        if (players.length == maxTeamSize * 2 - 1) {
            allReds = [];
            allBlues = [];
        }
        if (TeamR.length > TeamB.length) {
            for (var i = 0; i < n; i++) {
                room.setPlayerTeam(
                    TeamR[TeamR.length - 1 - i].id,
                    Team.SPECTATORS
                );
            }
        } else {
            for (var i = 0; i < n; i++) {
                room.setPlayerTeam(
                    TeamB[TeamB.length - 1 - i].id,
                    Team.SPECTATORS
                );
            }
        }
    } else if (
        Math.abs(TeamR.length - TeamB.length) < teamS.length &&
        TeamR.length != TeamB.length &&
        players.length != 6  // IMPORTANTE: No activar modo de selección para 6 jugadores
    ) {
        room.pauseGame(true);
        activateChooseMode();
        choosePlayer();
    } else if (
        teamS.length >= 2 &&
        TeamR.length == TeamB.length &&
        TeamR.length < maxTeamSize &&
        players.length != 6  // IMPORTANTE: No activar modo de selección para 6 jugadores
    ) {
        if (TeamR.length == 2) {
            quickRestart();
            loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
        } else if (TeamR.length >= 3) {
            quickRestart();
            loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
        }
        topBtn();
    }
}
}

function choosePlayer() {
console.log("Llamando a choosePlayer - Verificando condiciones");

// Actualizar equipos
updateTeams();

// Logs para diagnóstico
console.log("Estado actual: teamR =", TeamR.length, "teamB =", TeamB.length, "teamS =", teamS.length);

// Si no hay espectadores, finalizar selección
if (teamS.length === 0) {
    console.log("No quedan espectadores, finalizando modo elección");
    
    // Establecer flag de que acabamos de completar una selección
    window.justCompletedSelection = true;
    
    // Desactivar modo elección
    inChooseMode = false;
    blockGameStart = false;
    
    // Limpiar timeout
    clearTimeout(timeOutCap);
    
    // Anunciar fin de selección e iniciar partido
    room.sendAnnouncement(centerText("✅ Selección completada. El partido comenzará en unos segundos..."), null, 0x00FF00, "bold");
    
    setTimeout(() => {
        console.log("Iniciando partido después de choosePlayer");
        
        // Verificar mapa adecuado
        if (TeamR.length + TeamB.length <= 4) {
            loadMap(classicMap, scoreLimitClassic, timeLimitClassic);
        } else {
            loadMap(bigMap, scoreLimitBig, timeLimitBig);
        }
        
        // Iniciar partido
        room.startGame();
        room.sendAnnouncement(centerText("⚽ ¡COMIENZA EL PARTIDO!"), null, 0x00FF00, "bold");
    }, 2000);
    
    return;
}

// Verificar equipos
if (TeamR.length === 0 || TeamB.length === 0) {
    console.log("No hay suficientes jugadores en los equipos para continuar la selección");
    return;
}

// Limpiar timeout previo
clearTimeout(timeOutCap);

// Determinar capitán
let captain = null;
let captainTeam = null;

if (TeamR.length <= TeamB.length && TeamR.length !== 0) {
    captain = TeamR[0];
    captainTeam = Team.RED;
} else if (TeamB.length < TeamR.length && TeamB.length !== 0) {
    captain = TeamB[0];
    captainTeam = Team.BLUE;
}

// Verificar capitán
if (!captain) {
    console.log("No se pudo determinar un capitán válido");
    return;
}

console.log("Capitán seleccionado:", captain.name, "de equipo:", captainTeam === Team.RED ? "ROJO" : "AZUL");

// Enviar instrucciones al capitán
room.sendAnnouncement(
    "[PV] Tu turno de elegir. Ingresá el número o usá 'top', 'random' o 'bottom'.",
    captain.id,
    captainTeam === Team.RED ? 0xFF0000 : 0x0000FF,
    "bold"
);

// Configurar timeout para recordatorio
timeOutCap = setTimeout(
    function(player) {
        room.sendAnnouncement(
            '[PV] ¡Apurate @' + player.name + ', solo ' + Number.parseInt(chooseTime / 2) + ' segundos para elegir!',
            player.id,
            0xFFCC00,
            "bold"
        );
        
        // Timeout para kick
        timeOutCap = setTimeout(
            function(player) {
                if (inChooseMode) {
                    room.kickPlayer(
                        player.id,
                        "¡No elegiste a tiempo!",
                        false
                    );
                }
            },
            chooseTime * 500,
            player
        );
    },
    chooseTime * 1000,
    captain
);

// Mostrar lista de jugadores disponibles
getSpecList(captain);
}

function getSpecList(player) {
// Verificar que el jugador existe
if (!player) {
    console.error("Error: player es null en getSpecList");
    return;
}

console.log("Mostrando lista de espectadores a", player.name);

// Actualizar los equipos para tener la lista más reciente
updateTeams();

// Si no hay espectadores, finalizar la selección
if (teamS.length == 0) {
    console.log("No quedan espectadores para mostrar, finalizando selección");
    
    // Establecer flag de que acabamos de completar una selección
    window.justCompletedSelection = true;
    
    // Desactivar modo elección
    inChooseMode = false;
    blockGameStart = false;
    
    // Anunciar fin de selección e iniciar partido
    room.sendAnnouncement("✅ Selección completada. El partido comenzará en unos segundos...", null, 0x00FF00, "bold");
    
    setTimeout(() => {
        console.log("Iniciando partido desde getSpecList");
        
        // Verificar mapa adecuado
        if (TeamR.length + TeamB.length <= 4) {
            loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
        } else {
            loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
        }
        
        // Iniciar partido
        room.startGame();
        room.sendAnnouncement("⚽ ¡COMIENZA EL PARTIDO!", null, 0x00FF00, "bold");
    }, 1500);
    
    return;
}

// Crear el mensaje con la lista de jugadores
var cstm = '[PV] Jugadores disponibles: ';

// Generar una lista más clara
for (var i = 0; i < teamS.length; i++) {
    if (i === 0) {
        cstm += '\n';  // Empezar en nueva línea para mejor legibilidad
    }
    cstm += (i + 1) + '. ' + teamS[i].name + '\n';
}

// Agregar instrucciones
cstm += '\nUsá el número correspondiente a la lista de arriba para elegir un jugador.';

// Usar sendAnnouncement en lugar de sendChat
room.sendAnnouncement(cstm, player.id, 0x00FF00, "bold");

// Avisar a todos que se está eligiendo
room.sendAnnouncement("🎮 " + player.name + " está eligiendo jugadores...", null, 0xFFCC00);
}
function safeSetTeam(player, team) {
if (!player || !player.id) {
    console.error("Intento de mover jugador inválido a equipo", team);
    return false;
}

try {
    room.setPlayerTeam(player.id, team);
    return true;
} catch (error) {
    console.error("Error al mover jugador a equipo:", error);
    return false;
}
}
/* STATISTICS FUNCTIONS */

function getLastTouchOfTheBall() {
    const ballPosition = room.getBallPosition();
    updateTeams();
    for (var i = 0; i < players.length; i++) {
        if (players[i].position != null) {
            var distanceToBall = pointDistance(players[i].position, ballPosition);
            if (distanceToBall < triggerDistance) {
                !activePlay ? activePlay = true : null;
                if (lastTeamTouched == players[i].team && lastPlayersTouched[0] != null && lastPlayersTouched[0].id != players[i].id) {
                    lastPlayersTouched[1] = lastPlayersTouched[0];
                    lastPlayersTouched[0] = players[i];
                }
                lastTeamTouched = players[i].team;
            }
        }
    }
}

function getStats() { // gives possession, ball speed and GK of each team
    if (activePlay) {
        updateTeams();
        lastTeamTouched == Team.RED ? Rposs++ : Bposs++;
        var ballPosition = room.getBallPosition();
        point[1] = point[0];
        point[0] = ballPosition;
        ballSpeed = (pointDistance(point[0], point[1]) * 60 * 60 * 60) / 15000;
        var k = [-1, Infinity];
        for (var i = 0; i < TeamR.length; i++) {
            if (TeamR[i].position.x < k[1]) {
                k[0] = TeamR[i];
                k[1] = TeamR[i].position.x;
            }
        }
        k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
        k = [-1, -Infinity];
        for (var i = 0; i < TeamB.length; i++) {
            if (TeamB[i].position.x > k[1]) {
                k[0] = TeamB[i];
                k[1] = TeamB[i].position.x;
            }
        }
        k[0] != -1 ? setGK(k[0], getGK(k[0]) + 1) : null;
        findGK();
    }
}

function updateStats() {
    if (players.length >= 2 * maxTeamSize && (game.scores.time >= (5 / 6) * game.scores.timeLimit || game.scores.red == game.scores.scoreLimit || game.scores.blue == game.scores.scoreLimit) && allReds.length >= maxTeamSize && allBlues.length >= maxTeamSize) {
        var stats;
        for (var i = 0; i < allReds.length; i++) {
            localStorage.getItem(getAuth(allReds[i])) ? stats = JSON.parse(localStorage.getItem(getAuth(allReds[i]))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", allReds[i].name];
            stats[Ss.GA]++;
            lastWinner == Team.RED ? stats[Ss.WI]++ : lastWinner == Team.BLUE ? stats[Ss.LS]++ : stats[Ss.DR]++;
            stats[Ss.WR] = (100 * stats[Ss.WI] / stats[Ss.GA]).toPrecision(3);
            localStorage.setItem(getAuth(allReds[i]), JSON.stringify(stats));
        }
        for (var i = 0; i < allBlues.length; i++) {
            localStorage.getItem(getAuth(allBlues[i])) ? stats = JSON.parse(localStorage.getItem(getAuth(allBlues[i]))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", allBlues[i].name];
            stats[Ss.GA]++;
            lastWinner == Team.BLUE ? stats[Ss.WI]++ : lastWinner == Team.RED ? stats[Ss.LS]++ : stats[Ss.DR]++;
            stats[Ss.WR] = (100 * stats[Ss.WI] / stats[Ss.GA]).toPrecision(3);
            localStorage.setItem(getAuth(allBlues[i]), JSON.stringify(stats));
        }
        for (var i = 0; i < game.goals.length; i++) {
            if (game.goals[i].striker != null) {
                if ((allBlues.concat(allReds)).findIndex((player) => player.id == game.goals[i].striker.id) != -1) {
                    stats = JSON.parse(localStorage.getItem(getAuth(game.goals[i].striker)));
                    stats[Ss.GL]++;
                    localStorage.setItem(getAuth(game.goals[i].striker), JSON.stringify(stats));
                }
            }
            if (game.goals[i].assist != null) {
                if ((allBlues.concat(allReds)).findIndex((player) => player.name == game.goals[i].assist.name) != -1) {
                    stats = JSON.parse(localStorage.getItem(getAuth(game.goals[i].assist)));
                    stats[Ss.AS]++;
                    localStorage.setItem(getAuth(game.goals[i].assist), JSON.stringify(stats));
                }
            }
        }
        if (allReds.findIndex((player) => player.id == GKList[0].id) != -1) {
            stats = JSON.parse(localStorage.getItem(getAuth(GKList[0])));
            stats[Ss.GK]++;
            game.scores.blue == 0 ? stats[Ss.CS]++ : null;
            stats[Ss.CP] = (100 * stats[Ss.CS] / stats[Ss.GK]).toPrecision(3);
            localStorage.setItem(getAuth(GKList[0]), JSON.stringify(stats));
        }
        if (allBlues.findIndex((player) => player.id == GKList[1].id) != -1) {
            stats = JSON.parse(localStorage.getItem(getAuth(GKList[1])));
            stats[Ss.GK]++;
            game.scores.red == 0 ? stats[Ss.CS]++ : null;
            stats[Ss.CP] = (100 * stats[Ss.CS] / stats[Ss.GK]).toPrecision(3);
            localStorage.setItem(getAuth(GKList[1]), JSON.stringify(stats));
        }
    }
}

// Agregar estas funciones antes del onPlayerChat
function normalizeString(str) {
    return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s]/g, "")
            .trim();
}

function findClosestPlayer(searchName, excludeId) {
    searchName = normalizeString(searchName);
    let bestMatch = null;
    let bestSimilarity = 0;

    room.getPlayerList().forEach(player => {
        if (player.id !== excludeId) {
            const normalizedName = normalizeString(player.name);
            
            // Búsqueda exacta
            if (normalizedName === searchName) {
                bestMatch = player;
                bestSimilarity = 1;
                return;
            }
            
            // Búsqueda parcial
            if (normalizedName.includes(searchName) || searchName.includes(normalizedName)) {
                const similarity = Math.min(searchName.length, normalizedName.length) / 
                                Math.max(searchName.length, normalizedName.length);
                if (similarity > bestSimilarity) {
                    bestSimilarity = similarity;
                    bestMatch = player;
                }
            }
        }
    });

    // Retornamos el jugador solo si la similitud es mayor al 50%
    return bestSimilarity > 0.5 ? bestMatch : null;
}

function findGK() {
    var tab = [
        [-1, ""],
        [-1, ""]
    ];
    for (var i = 0; i < extendedP.length; i++) {
        if (room.getPlayer(extendedP[i][eP.ID]) != null && room.getPlayer(extendedP[i][eP.ID]).team == Team.RED) {
            if (tab[0][0] < extendedP[i][eP.GK]) {
                tab[0][0] = extendedP[i][eP.GK];
                tab[0][1] = room.getPlayer(extendedP[i][eP.ID]);
            }
        } else if (room.getPlayer(extendedP[i][eP.ID]) != null && room.getPlayer(extendedP[i][eP.ID]).team == Team.BLUE) {
            if (tab[1][0] < extendedP[i][eP.GK]) {
                tab[1][0] = extendedP[i][eP.GK];
                tab[1][1] = room.getPlayer(extendedP[i][eP.ID]);
            }
        }
    }
    GKList = [tab[0][1], tab[1][1]];
}

setInterval(() => {
    var tableau = [];
    if (statNumber % 5 == 0) {
        Object.keys(localStorage).forEach(function(key) {
            if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.GA])]);
            }
        });
        if (tableau.length < 5) {
            return false;
        }
        tableau.sort(function(a, b) {
            return b[1] - a[1];
        });
        room.sendChat("Matches Played> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
    }
    if (statNumber % 5 == 1) {
        Object.keys(localStorage).forEach(function(key) {
            if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.WI])]);
            }
        });
        if (tableau.length < 5) {
            return false;
        }
        tableau.sort(function(a, b) {
            return b[1] - a[1];
        });
        room.sendChat("Victories> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
    }
    if (statNumber % 5 == 2) {
        Object.keys(localStorage).forEach(function(key) {
            if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.GL])]);
            }
        });
        if (tableau.length < 5) {
            return false;
        }
        tableau.sort(function(a, b) {
            return b[1] - a[1];
        });
        room.sendChat("Gols> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
    }
    if (statNumber % 5 == 3) {
        Object.keys(localStorage).forEach(function(key) {
            if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.AS])]);
            }
        });
        if (tableau.length < 5) {
            return false;
        }
        tableau.sort(function(a, b) {
            return b[1] - a[1];
        });
        room.sendChat("Assistance> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
    }
    if (statNumber % 5 == 4) {
        Object.keys(localStorage).forEach(function(key) {
            if (!["player_name", "view_mode", "geo", "avatar", "player_auth_key"].includes(key)) {
                tableau.push([(JSON.parse(localStorage.getItem(key))[Ss.NK]), (JSON.parse(localStorage.getItem(key))[Ss.CS])]);
            }
        });
        if (tableau.length < 5) {
            return false;
        }
        tableau.sort(function(a, b) {
            return b[1] - a[1];
        });
        room.sendChat("CS> #1 " + tableau[0][0] + ": " + tableau[0][1] + " #2 " + tableau[1][0] + ": " + tableau[1][1] + " #3 " + tableau[2][0] + ": " + tableau[2][1] + " #4 " + tableau[3][0] + ": " + tableau[3][1] + " #5 " + tableau[4][0] + ": " + tableau[4][1]);
    }
    statNumber++;
}, statInterval * 60 * 1000);



// Mensajes para goles normales
const scorerMessages = [
    `⚽🎉 ¡Golazo de {scorer}!`,
    `🔥⚽ ¡Increíble definición de {scorer}! {gk} no pudo hacer nada.`,
    `💥🔥 {scorer} está imparable hoy, domina completamente a los de {rivalTeam}!`,
    `🤯💥⚡ ¡Qué golazo acaba de hacer {scorer}! ¡Espectacular!`,
    `👌⚽👏 ¡Bien definido por {scorer}!`,
    `🍷🚬🗿 La definición de {scorer} definitivamente es cine.`,
    `⚽🔥 ¡Golazo impresionante de {scorer}!`,
    `🔥⚽ Eduque {scorer}, eduque 👏👏`,
    `💪🔥⚽ Cuando sos crack, sos crack... ¡Y {scorer} lo acaba de demostrar! 👑`,
    `⚡⚽ {scorer} dejó sin opciones a {gk} con ese disparo perfecto!`,
    `💀⚽🔥 {rivalTeam} no sabe cómo detener a {scorer} hoy!`,
    `🤩⚡🔥 ¡Naa, qué golazo les marcó {scorer} a los de {rivalTeam}! 😱⚽`,
    `🎯⚽ ¡99 de definición! {scorer} la puso donde quería.`,
    `💥⚽🔥 ¡Ufff, qué golazo acaba de marcarle {scorer} a los de {rivalTeam}! 😱⚽`,
    `👀🔥 {scorer} dejó en ridículo a toda la defensa de {rivalTeam} con ese golazo!`
];

// Mensajes para autogoles
const ownGoalMessages = [
    `🤣 {scorer} Seguí así chad que vas a llegar muy cerca.🤦‍♂️`,
    `🤣 {scorer} Tenés que abrir el estadio, los burros hacen eso.🤦‍♂️`,
    `😵‍💫 Pero dale {scorer}, ¿tan quemado estás que la mandaste a tu propio arco? 🎯🤦‍♂️`,
    `🔥 Che, {scorer}, ¡la idea era hacer goles en el otro arco, master! 💀`,
    `💯 {scorer} vio un TikTok de "cómo NO jugar al haxball" y le salió de 10.`,
    `🔥 {scorer} es el jugador que todos queremos en el equipo... del rival.`,
    `🤨 {scorer}: "Quería probar si nuestro arquero estaba atento"`
];

// Función para obtener un mensaje aleatorio
function getRandomMessage(messages, replacements) {
    let message = messages[Math.floor(Math.random() * messages.length)];
    for (let key in replacements) {
        message = message.replace(`{${key}}`, replacements[key]);
    }
    return message;
}


// Definir commands antes de los eventos
const commands = {

// ... otros comandos ...


    'debugdb': (player) => {
        const role = getRole(player);
        if (role < Role.MASTER) {
            room.sendAnnouncement("❌ No tenés permisos para usar este comando", player.id, 0xFF0000);
            return false;
        }

        firebaseFetch('admins')
        .then(admins => {
            if (!admins) {
                room.sendAnnouncement("No hay admins registrados", player.id, 0xFFD700);
                return;
            }

            console.log("📝 Contenido de la base de datos:");
            console.log(JSON.stringify(admins, null, 2));
            
            room.sendAnnouncement("✅ Datos mostrados en la consola", player.id, 0x00FF00);
            
            room.sendAnnouncement("📊 Resumen de la base de datos:", player.id, 0xFFD700, "bold");
            let adminCount = 0;
            let roleCount = {
                [Role.MASTER]: 0,
                [Role.OWNER]: 0,
                [Role.CO_OWNER]: 0,
                [Role.SUPERADMIN]: 0,
                [Role.ADMIN_PERM]: 0
            };

            Object.values(admins).forEach(admin => {
                adminCount++;
                roleCount[admin.role]++;
            });

            room.sendAnnouncement(`Total de admins: ${adminCount}`, player.id, 0xFFD700);
            for (let role in roleCount) {
                if (roleCount[role] > 0) {
                    room.sendAnnouncement(`${getRoleName(parseInt(role))}: ${roleCount[role]}`, player.id, 0xFFD700);
                }
            }
        })
        .catch(error => {
            console.error("Error accediendo a la base de datos:", error);
            room.sendAnnouncement("❌ Error al acceder a la base de datos", player.id, 0xFF0000);
        });
        
        return false;
    },

    'checkrole': (player) => {
        const auth = getAuth(player);
        const role = getRole(player);
        room.sendAnnouncement(`Tu auth: ${auth}`, player.id, 0xFFFF00);
        room.sendAnnouncement(`Tu rol actual: ${getRoleName(role)}`, player.id, 0xFFFF00);
        room.sendAnnouncement(`Rol en Map: ${playerRoles.get(auth)}`, player.id, 0xFFFF00);
        return false;
    },
    // Comando para verificar tu auth
    'checkauth': (player) => {
        const playerData = extendedP.find(p => p[eP.ID] === player.id);
        const auth = playerData ? playerData[eP.AUTH] : null;
        
        if (auth) {
            room.sendAnnouncement(`Tu auth es: ${auth}`, player.id, 0x00FF00);
            room.sendAnnouncement(`Tu nombre es: ${player.name}`, player.id, 0x00FF00);
            room.sendAnnouncement(`Tu ID es: ${player.id}`, player.id, 0x00FF00);
        } else {
            room.sendAnnouncement("❌ No tenés auth asignado", player.id, 0xFF0000);
        }
        return false;
    },
    'removeadmin': (player, args) => {
        const role = getRole(player);
        if (role < Role.OWNER) {
            room.sendAnnouncement("❌ No tenés permisos para remover admins", player.id, 0xFF0000);
            return false;
        }

        if (!args[0]) {
            room.sendAnnouncement("❌ Uso: !removeadmin <auth>", player.id, 0xFF0000);
            return false;
        }

        const targetAuth = args[0];
        firebaseFetch(`admins/${targetAuth}`)
        .then(adminData => {
            if (!adminData) {
                room.sendAnnouncement("❌ No se encontró ningún admin con ese auth", player.id, 0xFF0000);
                return;
            }

            return firebaseFetch(`admins/${targetAuth}`, { method: 'DELETE' })
            .then(() => {
                room.sendAnnouncement(`✅ Admin removido: ${adminData.name} (${getRoleName(adminData.role)})`, player.id, 0x00FF00);
                
                const targetPlayer = room.getPlayerList().find(p => p.auth === targetAuth);
                if (targetPlayer) {
                    setPlayerRole(targetPlayer, Role.PLAYER);
                    room.sendAnnouncement("❌ Tu rol de admin ha sido removido", targetPlayer.id, 0xFF0000);
                }
            });
        })
        .catch(error => {
            console.error("Error removiendo admin:", error);
            room.sendAnnouncement("❌ Error al remover admin", player.id, 0xFF0000);
        });
        
        return false;
    },
    'testdb': (player) => {
        const role = getRole(player);
        if (role < Role.ADMIN_PERM) {
            room.sendAnnouncement("❌ No tenés permisos para usar este comando", player.id, 0xFF0000);
            return false;
        }

        const url = `${FIREBASE_URL}/test.json?auth=${FIREBASE_API_KEY}`;
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                timestamp: Date.now(),
                message: "Test de conexión"
            })
        })
        .then(() => {
            room.sendAnnouncement("✅ Conexión a la base de datos exitosa", player.id, 0x00FF00);
        })
        .catch(error => {
            console.error("Error:", error);
            room.sendAnnouncement("❌ Error de conexión", player.id, 0xFF0000);
        });

        return false;
    },

    'register': (player, args) => {
        if (args.length < 1) {
            room.sendAnnouncement("❌ Uso: !register <contraseña>", player.id, 0xFF0000);
            return false;
        }
        saveUser(player, args[0]);
        return false;
    },

    'mute': (player, args) => {
        const role = getRole(player);
        if (role < Role.ADMIN_PERM) {
            room.sendAnnouncement("❌ No tenés permisos para mutear jugadores.", player.id, 0xFF0000);
            return false;
        }

        if (!args[0] || !args[0].startsWith('#')) {
            room.sendAnnouncement("❌ Uso: !mute #ID <minutos>", player.id, 0xFF0000);
            return false;
        }

        const targetId = parseInt(args[0].substring(1));
        const minutes = parseInt(args[1]) || 5; // 5 minutos por defecto
        const target = room.getPlayer(targetId);

        if (!target) {
            room.sendAnnouncement("❌ Jugador no encontrado.", player.id, 0xFF0000);
            return false;
        }

        const until = Date.now() + (minutes * 60 * 1000);
        mutedPlayers.set(target.id, {
            name: target.name,
            auth: target.auth,
            until: until
        });

        room.sendAnnouncement(`🤐 ${player.name} muteó a ${target.name} por ${minutes} minutos.`, null, 0xFF4C4C);
        return false;
    },

    'ban': (player, args) => {
        const role = getRole(player);
        if (role < Role.ADMIN_PERM) {
            room.sendAnnouncement("❌ No tenés permisos para banear jugadores.", player.id, 0xFF0000);
            return false;
        }

        if (!args[0] || !args[0].startsWith('#')) {
            room.sendAnnouncement("❌ Uso: !ban #ID <minutos> <razón>", player.id, 0xFF0000);
            return false;
        }

        const targetId = parseInt(args[0].substring(1));
        const minutes = parseInt(args[1]) || 60; // 1 hora por defecto
        const reason = args.slice(2).join(' ') || "Sin razón especificada";
        const target = room.getPlayer(targetId);

        if (!target) {
            room.sendAnnouncement("❌ Jugador no encontrado.", player.id, 0xFF0000);
            return false;
        }

        const until = Date.now() + (minutes * 60 * 1000);
        bannedPlayers.set(target.auth, {
            name: target.name,
            until: until,
            reason: reason
        });

        room.kickPlayer(target.id, `Baneado por ${minutes} minutos. Razón: ${reason}`, true);
        room.sendAnnouncement(`🔨 ${player.name} baneó a ${target.name} por ${minutes} minutos. Razón: ${reason}`, null, 0xFF4C4C);
        return false;
    },

    'kick': (player, args) => {
        const role = getRole(player);
        if (role < Role.ADMIN_PERM) {
            room.sendAnnouncement("❌ No tenés permisos para kickear jugadores.", player.id, 0xFF0000);
            return false;
        }

        if (!args[0] || !args[0].startsWith('#')) {
            room.sendAnnouncement("❌ Uso: !kick #ID <razón>", player.id, 0xFF0000);
            return false;
        }

        const targetId = parseInt(args[0].substring(1));
        const reason = args.slice(1).join(' ') || "Sin razón especificada";
        const target = room.getPlayer(targetId);

        if (!target) {
            room.sendAnnouncement("❌ Jugador no encontrado.", player.id, 0xFF0000);
            return false;
        }

        room.kickPlayer(target.id, reason, false);
        room.sendAnnouncement(`👢 ${player.name} kickeó a ${target.name}. Razón: ${reason}`, null, 0xFF4C4C);
        return false;
    },

    'muteados': (player) => {
        const role = getRole(player);
        if (role < Role.ADMIN_PERM) {
            room.sendAnnouncement("❌ No tenés permisos para ver la lista de muteados.", player.id, 0xFF0000);
            return false;
        }

        if (mutedPlayers.size === 0) {
            room.sendAnnouncement("📝 No hay jugadores muteados.", player.id, 0x00FF00);
            return false;
        }

        room.sendAnnouncement("📝 Lista de jugadores muteados:", player.id, 0xFDC43A, "bold");
        mutedPlayers.forEach((data, id) => {
            const timeLeft = Math.ceil((data.until - Date.now()) / 60000);
            if (timeLeft > 0) {
                room.sendAnnouncement(`ID: ${id} | ${data.name} | ${timeLeft} minutos restantes`, player.id, 0xFDC43A);
            } else {
                mutedPlayers.delete(id);
            }
        });
        return false;
    },

    'baneados': (player) => {
        const role = getRole(player);
        if (role < Role.ADMIN_PERM) {
            room.sendAnnouncement("❌ No tenés permisos para ver la lista de baneados.", player.id, 0xFF0000);
            return false;
        }

        if (bannedPlayers.size === 0) {
            room.sendAnnouncement("📝 No hay jugadores baneados.", player.id, 0x00FF00);
            return false;
        }

        room.sendAnnouncement("📝 Lista de jugadores baneados:", player.id, 0xFDC43A, "bold");
        bannedPlayers.forEach((data, auth) => {
            const timeLeft = Math.ceil((data.until - Date.now()) / 60000);
            if (timeLeft > 0) {
                room.sendAnnouncement(`Auth: ${auth} | ${data.name} | ${timeLeft} minutos restantes | Razón: ${data.reason}`, player.id, 0xFDC43A);
            } else {
                bannedPlayers.delete(auth);
            }
        });
        return false;
    },

    'unmute': (player, args) => {
        const role = getRole(player);
        if (role < Role.ADMIN_PERM) {
            room.sendAnnouncement("❌ No tenés permisos para desmutear jugadores.", player.id, 0xFF0000);
            return false;
        }

        if (!args[0] || !args[0].startsWith('#')) {
            room.sendAnnouncement("❌ Uso: !unmute #ID", player.id, 0xFF0000);
            return false;
        }

        const targetId = parseInt(args[0].substring(1));
        if (mutedPlayers.has(targetId)) {
            const playerName = mutedPlayers.get(targetId).name;
            mutedPlayers.delete(targetId);
            room.sendAnnouncement(`🔊 ${player.name} desmuteó a ${playerName}`, null, 0x00FF00);
        } else {
            room.sendAnnouncement("❌ Jugador no encontrado en la lista de muteados.", player.id, 0xFF0000);
        }
        return false;
    },

    'unban': (player, args) => {
        const role = getRole(player);
        if (role < Role.ADMIN_PERM) {
            room.sendAnnouncement("❌ No tenés permisos para desbanear jugadores.", player.id, 0xFF0000);
            return false;
        }

        if (!args[0]) {
            room.sendAnnouncement("❌ Uso: !unban <auth>", player.id, 0xFF0000);
            return false;
        }

        const auth = args[0];
        if (bannedPlayers.has(auth)) {
            const playerName = bannedPlayers.get(auth).name;
            bannedPlayers.delete(auth);
            room.sendAnnouncement(`🔓 ${player.name} desbaneó a ${playerName}`, null, 0x00FF00);
        } else {
            room.sendAnnouncement("❌ Jugador no encontrado en la lista de baneados.", player.id, 0xFF0000);
        }
        return false;
    },

    'spy': (player) => {
        const role = getRole(player);
        if (role >= Role.ADMIN_PERM) {
            if (spyingAdmins.has(player.id)) {
                spyingAdmins.delete(player.id);
                room.sendAnnouncement("🕵️ Modo espía desactivado", player.id, 0xFF4C4C, "bold");
            } else {
                spyingAdmins.add(player.id);
                room.sendAnnouncement("🕵️ Modo espía activado. Ahora podés ver todos los mensajes", player.id, 0x00FF00, "bold");
            }
        } else {
            room.sendAnnouncement("❌ No tenés permisos para usar este comando", player.id, 0xFF0000);
        }
        return false;
    },

    'login': (player, args) => {
        if (args.length < 1) {
            room.sendAnnouncement("❌ Uso: !login <contraseña>", player.id, 0xFF0000);
            return false;
        }
        loginUser(player, args[0]);
        return false;
    },

'loginadm': (player, args) => {
        const auth = getAuth(player);
        if (!auth) {
            room.sendAnnouncement("❌ No se detectó tu auth. Reconectate a la sala.", player.id, 0xFF0000);
            return false;
        }

        if (args.length < 2) {
            room.sendAnnouncement("❌ Uso: !loginadm <rol> <contraseña>", player.id, 0xFF0000);
            return false;
        }

        const targetRole = args[0].toUpperCase();
        const password = args[1];

        if (!Role.hasOwnProperty(targetRole)) {
            room.sendAnnouncement("❌ Rol inválido", player.id, 0xFF0000);
            return false;
        }

        const roleValue = Role[targetRole];
        
        if (rolePasswords[roleValue] === password) {
            const url = `${FIREBASE_URL}/admins/${auth}.json?auth=${FIREBASE_API_KEY}`;
            fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    name: player.name,
                    role: roleValue,
                    password: password,
                    registeredDate: Date.now()
                })
            })
            .then(() => {
                // Actualizar el rol localmente
                playerRoles.set(auth, roleValue);
                
                // Debug para verificar
                console.log(`Rol asignado en loginadm: ${getRoleName(roleValue)}`);
                console.log(`Rol en Map después de asignar: ${playerRoles.get(auth)}`);
                
                // Aplicar el rol
                if (!setPlayerRole(player, roleValue)) {
                    throw new Error("Error al asignar el rol");
                }
                
                room.sendAnnouncement(`✅ ¡Registro exitoso como ${getRoleName(roleValue)}!`, player.id, 0x00FF00, "bold");
                
                if (roleValue === Role.MASTER) {
                    room.setPlayerAdmin(player.id, true);
                }
                
                // Verificar que el rol se asignó correctamente
                const currentRole = getRole(player);
                room.sendAnnouncement(`Debug - Rol actual: ${getRoleName(currentRole)}`, player.id, 0xFFFF00);
            })
            .catch(error => {
                console.error("Error:", error);
                room.sendAnnouncement("❌ Error al registrar", player.id, 0xFF0000);
            });
        } else {
            room.sendAnnouncement("❌ Contraseña incorrecta", player.id, 0xFF0000);
        }
        return false;
    },

    'admins': (player) => {
        const role = getRole(player);
        if (role < Role.MASTER) {
            room.sendAnnouncement("❌ No tenés permisos para ver la lista de admins", player.id, 0xFF0000);
            return false;
        }

        const adminsRef = firebase.database().ref('admins');
        adminsRef.once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                room.sendAnnouncement("No hay admins registrados", player.id, 0xFFD700);
                return;
            }

            room.sendAnnouncement("📝 Lista de Admins Registrados:", player.id, 0xFFD700, "bold");
            snapshot.forEach(childSnapshot => {
                const auth = childSnapshot.key;
                const adminData = childSnapshot.val();
                const date = new Date(adminData.registeredDate).toLocaleDateString();
                room.sendAnnouncement(`${getRoleName(adminData.role)} | ${adminData.name} | Auth: ${auth} | Registrado: ${date}`, 
                    player.id, 0xFFD700);
            });
        })
        .catch(error => {
            console.error("Error obteniendo lista de admins:", error);
            room.sendAnnouncement("❌ Error al obtener la lista de admins", player.id, 0xFF0000);
        });
        
        return false;
    },

    'removeadmin': (player, args) => {
        const role = getRole(player);
        if (role < Role.MASTER) {
            room.sendAnnouncement("❌ No tenés permisos para remover admins", player.id, 0xFF0000);
            return false;
        }

        if (!args[0]) {
            room.sendAnnouncement("❌ Uso: !removeadmin <auth>", player.id, 0xFF0000);
            return false;
        }

        const targetAuth = args[0];
        const adminRef = firebase.database().ref(`admins/${targetAuth}`);

        adminRef.once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                room.sendAnnouncement("❌ No se encontró ningún admin con ese auth", player.id, 0xFF0000);
                return;
            }

            const adminData = snapshot.val();
            adminRef.remove()
            .then(() => {
                room.sendAnnouncement(`✅ Admin removido: ${adminData.name} (${getRoleName(adminData.role)})`, player.id, 0x00FF00);
                
                // Si el admin está en la sala, actualizar su rol
                const targetPlayer = room.getPlayerList().find(p => p.auth === targetAuth);
                if (targetPlayer) {
                    setPlayerRole(targetPlayer, Role.PLAYER);
                    room.sendAnnouncement("❌ Tu rol de admin ha sido removido", targetPlayer.id, 0xFF0000);
                }
            });
        })
        .catch(error => {
            console.error("Error removiendo admin:", error);
            room.sendAnnouncement("❌ Error al remover admin", player.id, 0xFF0000);
        });
        
        return false;
    },

    'auth': (player) => {
        const role = getRole(player);
        if (role >= Role.MASTER) {
            room.sendAnnouncement(`Auth de ${player.name}: ${player.auth}`, player.id, 0x00FF00);
        } else {
            room.sendAnnouncement("❌ No tenés permisos para ver tu auth", player.id, 0xFF0000);
        }
        return false;
    },

    'admin': (player) => {
        const role = getRole(player);
        if (role >= Role.OWNER) {
            if (player.admin) {
                room.setPlayerAdmin(player.id, false);
                room.sendAnnouncement(`🔒 Admin removido de ${player.name}`, null, 0xFF0000);
            } else {
                room.setPlayerAdmin(player.id, true);
                room.sendAnnouncement(`🔓 Admin dado a ${player.name}`, null, 0x00FF00);
            }
        } else {
            room.sendAnnouncement("❌ No tenés permiso para usar este comando", player.id, 0xFF0000);
        }
        return false;
    },

    'role': (player) => {
        const roleData = playerRoles.get(player.auth);
        if (roleData) {
            const roleName = getRoleName(roleData.role);
            room.sendAnnouncement(`👤 Tu rol actual es: ${roleName}`, player.id, 0xFFD700);
            room.sendAnnouncement(`📅 Asignado el: ${new Date(roleData.assignedAt).toLocaleString()}`, player.id, 0xFFD700);
        } else {
            room.sendAnnouncement(`❌ No tenés un rol asignado`, player.id, 0xFF0000);
        }
        return false;
    },

    'stats': (player) => {
        const auth = getAuth(player);
        if (!auth) {
            room.sendAnnouncement("❌ No se detectó tu auth", player.id, 0xFF0000);
            return false;
        }

        const url = `${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`;
        fetch(url)
        .then(response => response.json())
        .then(userData => {
            if (!userData) {
                room.sendAnnouncement("❌ No estás registrado", player.id, 0xFF0000);
                return;
            }

            const stats = userData.stats;
            room.sendAnnouncement("📊 Tus estadísticas:", player.id, 0x00FF00, "bold");
            room.sendAnnouncement(`Partidos: ${stats.games}`, player.id, 0x00FF00);
            room.sendAnnouncement(`Victorias: ${stats.wins}`, player.id, 0x00FF00);
            room.sendAnnouncement(`Goles: ${stats.goals}`, player.id, 0x00FF00);
            room.sendAnnouncement(`Asistencias: ${stats.assists}`, player.id, 0x00FF00);
            room.sendAnnouncement(`Clean Sheets: ${stats.cs}`, player.id, 0x00FF00);
            room.sendAnnouncement(`Partidos de GK: ${stats.gk}`, player.id, 0x00FF00);
        })
        .catch(error => {
            console.error("Error obteniendo stats:", error);
            room.sendAnnouncement("❌ Error al obtener estadísticas", player.id, 0xFF0000);
        });
        
        return false;
    },

    'goats': (player) => {
        const players = getTopPlayers();
        
        // Ordenamos por goles, asistencias y vallas invictas
        const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 3);
        const topAssists = [...players].sort((a, b) => b.assists - a.assists).slice(0, 3);
        const topKeepers = [...players].sort((a, b) => b.cs - a.cs).slice(0, 3);

        room.sendAnnouncement("👑 SALÓN DE LA FAMA - GOATS:", player.id, 0xFDC43A, "bold");
        
        // Mostramos los goleadores
        room.sendAnnouncement("⚽ TOP GOLEADORES:", player.id, 0xFDC43A, "bold");
        topScorers.forEach((p, i) => {
            const medals = ["🥇", "🥈", "🥉"];
            room.sendAnnouncement(`${medals[i]} ${p.name} - ${p.goals} goles`, player.id, 0xFDC43A);
        });

        // Mostramos los asistidores
        room.sendAnnouncement("👟 TOP ASISTENCIAS:", player.id, 0xFDC43A, "bold");
        topAssists.forEach((p, i) => {
            const medals = ["🥇", "🥈", "🥉"];
            room.sendAnnouncement(`${medals[i]} ${p.name} - ${p.assists} asistencias`, player.id, 0xFDC43A);
        });

        // Mostramos los porteros
        room.sendAnnouncement("🧤 TOP VALLAS INVICTAS:", player.id, 0xFDC43A, "bold");
        topKeepers.forEach((p, i) => {
            const medals = ["🥇", "🥈", "🥉"];
            room.sendAnnouncement(`${medals[i]} ${p.name} - ${p.cs} vallas invictas`, player.id, 0xFDC43A);
        });

        return false;
    },


    'me': (player) => {
        let stats = JSON.parse(localStorage.getItem(getAuth(player))) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
        room.sendAnnouncement(`[📄] Estadísticas de ${player.name}:`, player.id, 0x73EC59, "bold");
        room.sendAnnouncement(`🎮 Partidos: ${stats[Ss.GA]} | ✅ Victorias: ${stats[Ss.WI]} | ❌ Derrotas: ${stats[Ss.LS]} | WR: ${stats[Ss.WR]}%`, player.id, 0x73EC59);
        room.sendAnnouncement(`⚽️ Goles: ${stats[Ss.GL]} | 👟 Asistencias: ${stats[Ss.AS]} | 🤚 Vallas: ${stats[Ss.GK]} | 🧤 Vallas invictas: ${stats[Ss.CS]} (${stats[Ss.CP]}%)`, player.id, 0x73EC59);
        room.sendAnnouncement("「👓」 Este mensaje solo lo ves vos. Usá '!showme' para mostrar tus stats a todos!", player.id, 0xFF7900, "bold");
        return false;
    },

    'showme': (player) => {
        let stats = JSON.parse(localStorage.getItem(getAuth(player))) || [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00"];
        room.sendAnnouncement(`[📄] ¡${player.name} mostró sus estadísticas!`, null, 0xFF7900, "bold");
        room.sendAnnouncement(`[📄] Estadísticas de ${player.name}:`, null, 0x73EC59, "bold");
        room.sendAnnouncement(`🎮 Partidos: ${stats[Ss.GA]} | ✅ Victorias: ${stats[Ss.WI]} | ❌ Derrotas: ${stats[Ss.LS]} | WR: ${stats[Ss.WR]}%`, null, 0x73EC59);
        room.sendAnnouncement(`⚽️ Goles: ${stats[Ss.GL]} | 👟 Asistencias: ${stats[Ss.AS]} | 🤚 Vallas: ${stats[Ss.GK]} | 🧤 Vallas invictas: ${stats[Ss.CS]} (${stats[Ss.CP]}%)`, null, 0x73EC59);
        return false;
    },

    'wh': (player) => {
        if (player.team == Team.RED && player.id == TeamR[0].id) {
            CaptainChoice = "!wh";
            room.setTeamColors(Team.RED, 0, 0x000000, [0xffffff]);
            room.sendAnnouncement(`El capitán del equipo rojo, ${player.name}, eligió el uniforme [Brasil]!`, null, 0x30F55F, "bold");
        }
        else if (player.team == Team.BLUE && player.id == TeamB[0].id) {
            CaptainChoice = "!wh";
            room.setTeamColors(Team.BLUE, 0, 0x000000, [0xffffff]);
            room.sendAnnouncement(`El capitán del equipo azul, ${player.name}, eligió el uniforme [Brasil]!`, null, 0x30F55F, "bold");
        }
        return false;
    },

    'bl': (player) => {
        if (player.team == Team.RED && player.id == TeamR[0].id) {
            CaptainChoice = "!bl";
            room.setTeamColors(Team.RED, 90, 0xFFFFFF, [0x000000]);
            room.sendAnnouncement(`El capitán del equipo rojo, ${player.name}, eligió el uniforme [Alemania]!`, null, 0x30F55F, "bold");
        }
        else if (player.team == Team.BLUE && player.id == TeamB[0].id) {
            CaptainChoice = "!bl";
            room.setTeamColors(Team.BLUE, 90, 0xFFFFFF, [0x000000]);
            room.sendAnnouncement(`El capitán del equipo azul, ${player.name}, eligió el uniforme [Alemania]!`, null, 0x30F55F, "bold");
        }
        return false;
    },

    'ranks': (player) => {
        room.sendAnnouncement("🏆 RANGOS POR GOLES:", player.id, 0xFDC43A, "bold");
        room.sendAnnouncement("⚪ Novato (0-4) | 🔘 Amateur (5-9) | 🥉 Semi-Pro (10-19)", player.id, 0xFDC43A);
        room.sendAnnouncement("🥈 Profesional (20-29) | 🥇 Estrella (30-39) | 💫 Súper Estrella (40-49)", player.id, 0xFDC43A);
        room.sendAnnouncement("💎 Leyenda (50-74) | 👑 GOAT (75+)", player.id, 0xFDC43A);
        return false;
    },

    'goats': (player) => {
        room.sendAnnouncement("👑 SALÓN DE LA FAMA - GOATS:", player.id, 0xFDC43A, "bold");
        room.sendAnnouncement("🥇 Pelé - 77 goles", player.id, 0xFDC43A);
        room.sendAnnouncement("🥈 Maradona - 76 goles", player.id, 0xFDC43A);
        room.sendAnnouncement("🥉 Messi - 75 goles", player.id, 0xFDC43A);
        return false;
    },


    'help': (player) => {
        // Comandos básicos
        room.sendAnnouncement("📋 COMANDOS BÁSICOS:", player.id, 0x30F55F, "bold");
        room.sendAnnouncement("!register <contraseña> - Registrarse | !login <contraseña> - Iniciar sesión | !role - Ver rol | !stats - Ver estadísticas", player.id, 0x30F55F);
        
        // Comandos de juego
        room.sendAnnouncement("🎮 COMANDOS DE JUEGO:", player.id, 0x30F55F, "bold");
        room.sendAnnouncement("!bl camiseta negra !wh camiseta blanca | t <mensaje> - Chat de equipo", player.id, 0x30F55F);
        
        // Comandos de estadísticas
        room.sendAnnouncement("📊 COMANDOS DE ESTADÍSTICAS:", player.id, 0x30F55F, "bold");
        room.sendAnnouncement("!games - Partidos jugados | !wins - Victorias | !goals - Goles | !assists - Asistencias | !cs - Vallas invictas", player.id, 0x30F55F);
        room.sendAnnouncement("!me - Ver mis stats | !showme - Mostrar stats a todos | !ranks - Ver rangos", player.id, 0x30F55F);
        
        // Comandos de moderación (solo para admins)
        if (getRole(player) >= Role.ADMIN_PERM) {
            room.sendAnnouncement("🛡️ COMANDOS DE MODERACIÓN:", player.id, 0x30F55F, "bold");
            room.sendAnnouncement("!admin - Dar/quitar admin | !mute <duración=3> #<id> - Silenciar | !unmute all/#<id> - Desilenciar", player.id, 0x30F55F);
            room.sendAnnouncement("!slow <duración> - Modo lento | !endslow - Quitar modo lento", player.id, 0x30F55F);
        }
        
        // Comandos de admin (solo para OWNER y MASTER)
        if (getRole(player) >= Role.OWNER) {
            room.sendAnnouncement("👑 COMANDOS DE ADMIN:", player.id, 0x30F55F, "bold");
            room.sendAnnouncement("!loginadm <contraseña> - Login como admin | !clearbans <número=all> - Limpiar bans", player.id, 0x30F55F);
        }
                // Comandos de moderación (solo para admins)
                if (getRole(player) >= Role.ADMIN_PERM) {
                    room.sendAnnouncement("🛡️ COMANDOS DE MODERACIÓN:", player.id, 0x30F55F, "bold");
                    room.sendAnnouncement("!admin - Dar/quitar admin | !mute <duración=3> #<id> - Silenciar | !unmute all/#<id> - Desilenciar", player.id, 0x30F55F);
                    room.sendAnnouncement("!slow <duración> - Modo lento | !endslow - Quitar modo lento | !spy - Activar/desactivar espía", player.id, 0x30F55F);
                }
        
        return false;
    }
};


/* EVENTS */

/* PLAYER MOVEMENT */

room.onPlayerJoin = function(player) {
    console.log("---------------------------------------------------");
    console.log("[📢] Nick: " + player.name);
    console.log("[📢] Conn: " + player.conn);
    console.log("[📢] Auth: " + player.auth);
    
    // Inicializar extendedP con la actividad actual
    extendedP.push([player.id, player.auth, player.conn, false, Date.now(), 0, false]);
    updateRoleOnPlayerIn();

    // Verificar si el jugador está baneado
    if (bannedPlayers.has(getAuth(player))) {
        const banData = bannedPlayers.get(getAuth(player));
        const timeLeft = Math.ceil((banData.until - Date.now()) / 60000);
        
        if (timeLeft > 0) {
            room.kickPlayer(player.id, `Todavía estás baneado por ${timeLeft} minutos. Razón: ${banData.reason}`, true);
            return;
        } else {
            bannedPlayers.delete(getAuth(player));
        }
    }

    // Verificar admin en Firebase primero
    const auth = getAuth(player);
    if (auth) {
        const url = `${FIREBASE_URL}/admins/${auth}.json?auth=${FIREBASE_API_KEY}`;
        fetch(url)
        .then(response => response.json())
        .then(adminData => {
            if (adminData && adminData.role) {
                // Guardar el rol en el Map local
                playerRoles.set(auth, adminData.role);
                
                // Aplicar el rol
                setPlayerRole(player, adminData.role);
                
                // Mensajes personalizados según el rol
                let welcomeMessage = "";
                let color = 0xFFD700;
                
                switch (adminData.role) {
                    case Role.MASTER:
                        welcomeMessage = `👑 ¡Bienvenido de nuevo MASTER ${player.name}!`;
                        room.setPlayerAdmin(player.id, true);
                        break;
                    case Role.OWNER:
                        welcomeMessage = `👑 ¡Bienvenido de nuevo OWNER ${player.name}!`;
                        break;
                    case Role.CO_OWNER:
                        welcomeMessage = `⭐ ¡Bienvenido de nuevo CO-OWNER ${player.name}!`;
                        break;
                    case Role.SUPERADMIN:
                        welcomeMessage = `🔰 ¡Bienvenido de nuevo SUPERADMIN ${player.name}!`;
                        break;
                    case Role.ADMIN_PERM:
                        welcomeMessage = `🛡️ ¡Bienvenido de nuevo ADMIN ${player.name}!`;
                        break;
                }
                
                if (welcomeMessage) {
                    room.sendAnnouncement(welcomeMessage, player.id, color, "bold");
                    room.sendAnnouncement("✅ Login automático completado", player.id, 0x00FF00, "bold");
                }

                // Verificar stats del jugador después
                return fetch(`${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`);
            } else {
                // Si no es admin, verificar si es jugador registrado
                return fetch(`${FIREBASE_URL}/players/${auth}.json?auth=${FIREBASE_API_KEY}`);
            }
        })
        .then(response => response.json())
        .then(userData => {
            if (userData) {
                room.sendAnnouncement("✅ ¡Bienvenido de vuelta, " + player.name + "!", player.id, 0x00FF00);
            } else {
                room.sendAnnouncement("👋 ¡Bienvenido! Usá !register <contraseña> para registrarte", player.id, 0xFF7B00);
            }
        })
        .catch(error => {
            console.error("Error en login automático:", error);
            room.sendAnnouncement("❌ Error en el login automático", player.id, 0xFF0000);
        });
    }

    room.sendAnnouncement("👋🏼 Bienvenido " + player.name + ", jugá como un chad.", null, 0x5EE7FF, "bold");
    if (room.getPlayerList().length > 1 && room.getPlayerList().length < 5) {
        room.sendAnnouncement("Loading the stadium...", player.id, 0xEDC021, "bold");
        setTimeout(() => {
            room.sendAnnouncement(" ---------------------------------------------------", player.id, 0xEDC021, "bold");
            room.sendAnnouncement("LA SALA ESTÁ SUJETA A CAMBIOS, PROYECTO EN PROGRESO...", player.id, 0xEDC021, "bold");
            room.sendAnnouncement(" ---------------------------------------------------", player.id, 0xEDC021, "bold");
        }, 2_000);
    }
    if (localStorage.getItem(player.auth) != null) {
        var playerRole = JSON.parse(localStorage.getItem(player.auth))[Ss.RL];
        if (playerRole == "admin" || playerRole == "master") {
            room.setPlayerAdmin(player.id, true);
            room.sendAnnouncement("「Admin」" + player.name + " bienvenido de nuevo!", null, 0xFF7900, "bold");
        }
    }
    if (localStorage.getItem(getAuth(player)) == null) {
        stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player", player.name]
        localStorage.setItem(getAuth(player), JSON.stringify(stats));
    }

    fetch(`${FIREBASE_URL}/users/${player.auth}.json?auth=${FIREBASE_API_KEY}`)
    .then(response => response.json())
    .then(userData => {
        if (userData) {
            room.sendAnnouncement('👋 ¡Bienvenido de vuelta! Usá !login <contraseña> para iniciar sesión', player.id, 0x1B9124, "bold");
        } else {
            room.sendAnnouncement('📝 ¡Nuevo jugador! Usá !register <contraseña> para registrarte', player.id, 0x1B9124, "bold");
        }
    })
    .catch(error => {
        room.sendAnnouncement("⚠️ Error verificando usuario: " + error.message, player.id, 0xFF0000);
    });

    // Intentar login automático
    fetch(`${FIREBASE_URL}/users/${player.auth}.json?auth=${FIREBASE_API_KEY}`)
    .then(response => response.json())
    .then(userData => {
        if (userData) {
            // Si encontramos el usuario, intentamos login automático
            fetch(`${FIREBASE_URL}/users.json?auth=${FIREBASE_API_KEY}`)
            .then(response => response.json())
            .then(allUsers => {
                const existingUser = Object.entries(allUsers).find(([_, user]) => 
                    user.auth === player.auth
                );

                if (existingUser) {
                    const [_, userData] = existingUser;
                    completeLogin(player, userData);
                } else {
                    room.sendAnnouncement('👋 ¡Bienvenido de vuelta! Usá !login <contraseña> para iniciar sesión', player.id, 0x1B9124, "bold");
                }
            });
        }
    })
    .catch(error => {
        room.sendAnnouncement("⚠️ Error verificando usuario: " + error.message, player.id, 0xFF0000);
    });
}
// Asegurarnos que la actividad se actualice cuando el jugador se mueve
room.onPlayerActivity = function(player) {
setActivity(player, Date.now());
if (getAFK(player)) {
    setAFK(player, false);
    // Restaurar el rol original
    if (player.originalRole !== undefined) {
        setPlayerRole(player, player.originalRole);
        player.originalRole = undefined;
    }
}
}

room.onPlayerTeamChange = function(changedPlayer, byPlayer) {
    console.log("Cambio de equipo: " + (changedPlayer ? changedPlayer.name : "null") + 
                " por " + (byPlayer ? byPlayer.name : "sistema"));
    
    // CASO ESPECIAL: Si tenemos exactamente 6 jugadores, forzar 3v3 y evitar modo selección
    updateTeams();
    if (players.length == 6) {
        console.log("6 jugadores detectados en onPlayerTeamChange");
        
        // Desactivar modo de selección si está activo
        if (inChooseMode) {
            inChooseMode = false;
            blockGameStart = false;
            console.log("Forzando desactivación del modo selección");
            
            // Despausar juego si está pausado
            if (room.getScores() !== null) {
                room.pauseGame(false);
            }
        }
        
        // Si tenemos 3 jugadores por equipo, iniciar partido
        if (TeamR.length == 3 && TeamB.length == 3) {
            console.log("Equipos 3v3 completos, iniciando partido");
            // Verificar si hay un partido en curso, si no, iniciarlo
            if (room.getScores() === null) {
                if (safeStartGame()) {
                    room.startGame();
                    room.sendAnnouncement("⚽ ¡COMIENZA EL PARTIDO 3v3!", null, 0x00FF00, "bold");
                }
            } else {
                // Si hay un partido pausado, despausarlo
                room.pauseGame(false);
            }
        }
        // Si los equipos no están equilibrados pero suman 6, equilibrarlos
        else if (TeamR.length + TeamB.length == 6) {
            console.log("Equipos desequilibrados, reajustando para 3v3");
            // Reiniciar a todos a espectadores y distribuir 3v3
            resetBtn();
            setTimeout(() => {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        randomBtn();
                    }, i * 150);
                }
                
                setTimeout(() => {
                    if (room.getScores() === null) {
                        if (safeStartGame()) {
                            room.startGame();
                            room.sendAnnouncement("⚽ ¡COMIENZA EL PARTIDO 3v3!", null, 0x00FF00, "bold");
                        }
                    } else {
                        room.pauseGame(false);
                    }
                }, 800);
            }, 300);
        }
        
        return; // No seguir con la lógica normal para 6 jugadores
    }
     
    if (!changedPlayer) {
        console.error("changedPlayer es null en onPlayerTeamChange");
        return;
    }
    
    if (changedPlayer.id == 0) {
        room.setPlayerTeam(0, Team.SPECTATORS);
        return;
    }
    
    if (getAFK(changedPlayer) && changedPlayer.team != Team.SPECTATORS) {
        room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
        room.sendChat(changedPlayer.name + " it's AFK!");
        return;
    }
    
    updateTeams();
    
    if (room.getScores() != null) {
        var scores = room.getScores();
        if (changedPlayer.team != Team.SPECTATORS && scores.time <= (3 / 4) * scores.timeLimit && Math.abs(scores.blue - scores.red) < 2) {
            (changedPlayer.team == Team.RED) ? allReds.push(changedPlayer): allBlues.push(changedPlayer);
        }
    }
    
    if (changedPlayer.team == Team.SPECTATORS) {
        setActivity(changedPlayer, 0);
    }
    
    // Manejo cuando byPlayer es null (cambio automático)
    if (!byPlayer) {
        console.log("Cambio de equipo automático para: " + changedPlayer.name);
        
        // Reiniciar juego si los equipos están completos
        if (TeamR.length >= 2 && TeamB.length >= 2 && !room.getScores()) {
            setTimeout(() => {
                room.startGame();
                console.log("Iniciando juego automáticamente después de pick");
            }, 2000);
        }
        
        return;
    }
    
    // Lógica para modo selección cuando hay cambios de equipo por el sistema
    if (inChooseMode && resettingTeams == false && byPlayer.id == 0) {
        // Verificar que teamS existe y tiene elementos
        if (!teamS || teamS.length === 0) {
            console.warn("teamS está vacío en onPlayerTeamChange");
            return;
        }
        
        // Caso donde la diferencia entre equipos es igual a la cantidad de espectadores
        if (Math.abs(TeamR.length - TeamB.length) == teamS.length) {
            console.log("Diferencia de equipos igual a cantidad de espectadores - distribuyendo");
            
            // Cancelamos el modo de elección pero sin iniciar juego automáticamente
            cancelChooseMode("Distribuyendo jugadores restantes");
            
            // Distribuimos jugadores manualmente
            var b = teamS.length;
            if (TeamR.length > TeamB.length) {
                for (var i = 0; i < b; i++) {
                    setTimeout(function(index) {
                        if (teamS && teamS[0]) {
                            room.setPlayerTeam(teamS[0].id, Team.BLUE);
                        }
                    }, 200 * i, i);
                }
            } else {
                for (var i = 0; i < b; i++) {
                    setTimeout(function(index) {
                        if (teamS && teamS[0]) {
                            room.setPlayerTeam(teamS[0].id, Team.RED);
                        }
                    }, 200 * i, i);
                }
            }
            
            // Una vez distribuidos, iniciamos el juego con mapa adecuado
            setTimeout(() => {
                const playerCount = room.getPlayerList().filter(p => p.team !== Team.SPECTATORS).length;
                
                // Reiniciamos para cargar el mapa adecuado
                quickRestart();
                
                if (playerCount <= 4) {
                    console.log("Cargando mapa clásico para " + playerCount + " jugadores");
                    loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
                } else {
                    console.log("Cargando mapa grande para " + playerCount + " jugadores");
                    loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
                }
                
                // Iniciamos juego después de cargar mapa
                setTimeout(() => {
                    room.startGame();
                    console.log("Iniciando juego después de distribuir jugadores");
                    room.sendAnnouncement("⚽ ¡COMIENZA EL PARTIDO!", null, 0x00FF00, "bold");
                }, 1000);
            }, b * 200 + 300);
            
            return;
        } 
        // Caso donde los equipos están completos o balanceados con menos de 2 espectadores
        else if ((TeamR.length == maxTeamSize && TeamB.length == maxTeamSize) || (TeamR.length == TeamB.length && teamS.length < 2)) {
            console.log("Equipos balanceados o completos - finalizando selección");
            finishChooseMode("Equipos balanceados");
        }
    }
}
// Y agregamos un comando separado para dar/quitar admin
room.onCommand_admin = function(player) {
    const role = getRole(player);
    if (role >= Role.OWNER) { // Solo OWNER y MASTER pueden usar este comando
        if (player.admin) {
            room.setPlayerAdmin(player.id, false);
            room.sendAnnouncement(`🔒 Admin removido de ${player.name}`, null, 0xFF0000);
        } else {
            room.setPlayerAdmin(player.id, true);
            room.sendAnnouncement(`🔓 Admin dado a ${player.name}`, null, 0x00FF00);
        }
    }
    return false;
}

// Mejorar el comando role para mostrar más info
room.onCommand_role = function(player) {
    const roleData = playerRoles.get(player.auth);
    if (roleData) {
        const roleName = getRoleName(roleData.role);
        room.sendAnnouncement(`👤 Tu rol actual es: ${roleName}`, player.id, 0xFFD700);
        room.sendAnnouncement(`📅 Asignado el: ${new Date(roleData.assignedAt).toLocaleString()}`, player.id, 0xFFD700);
    } else {
        room.sendAnnouncement(`❌ No tenés un rol asignado`, player.id, 0xFF0000);
    }
    return false;
}

room.onPlayerLeave = function(player) {
    setActivity(player, 0);
    updateTeams(); // Primero actualizamos los equipos
    
    // Después hacemos los chequeos con los equipos actualizados
    if (inChooseMode) {
        const isRedCaptain = TeamR.findIndex((red) => red.id == player.id) == 0;
        const isBlueCaptain = TeamB.findIndex((blue) => blue.id == player.id) == 0;
        
        if ((isRedCaptain && TeamR.length <= TeamB.length) || 
            (isBlueCaptain && TeamB.length < TeamR.length)) {
            choosePlayer();
            capLeft = true;
            setTimeout(() => {
                capLeft = false;
            }, 10);
        }
    }

            // Si el jugador estaba AFK, limpiamos su estado
            if (getAFK(player)) {
                setAFK(player, false);
            }
    
    balanceTeams();
    setActivity(player, 0);
    updateRoleOnPlayerOut();
    handleInactivity();
}

room.onPlayerKicked = function(kickedPlayer, reason, ban, byPlayer) {
    ban == true ? banList.push([kickedPlayer.name, kickedPlayer.id]) : null;
    handleInactivity();
}

/* PLAYER ACTIVITY */

room.onPlayerChat = function(player, message) {
    const role = getRole(player);
    let prefix = "";
    let chatColor = 0xFFFFFF; // Color por defecto
    let comando = message.toLowerCase().trim();
   // Primero verificamos si está AFK
// Primero verificamos si está AFK
if (getAFK(player)) {
// Verificar si es un rol superior
const currentRole = getRole(player);
if (currentRole >= Role.SUPERADMIN) { // MASTER, OWNER, CO_OWNER, SUPERADMIN
    // Mantener el prefijo y color del rol superior
    switch (currentRole) {
        case Role.MASTER:
            prefix = "👑 ";
            chatColor = 0xFFD700;
            break;
        case Role.OWNER:
            prefix = "👑 ";
            chatColor = 0xFFD700;
            break;
        case Role.CO_OWNER:
            prefix = "⭐ ";
            chatColor = 0x00FF00;
            break;
        case Role.SUPERADMIN:
            prefix = "🔰 ";
            chatColor = 0x00FF00;
            break;
    }
} else {
    // Para roles inferiores, usar el prefijo AFK
    prefix = "💤 ";
    chatColor = 0xAAAAAA;
}
} else {
// Si no está AFK, aplicar el rol normal
switch (role) {
    case Role.MASTER:
        prefix = "👑 ";
        chatColor = 0xFFD700;
        break;
    case Role.OWNER:
        prefix = "👑 ";
        chatColor = 0xFFD700;
        break;
    case Role.CO_OWNER:
        prefix = "⭐ ";
        chatColor = 0x00FF00;
        break;
    case Role.SUPERADMIN:
        prefix = "🔰 ";
        chatColor = 0x00FF00;
        break;
    case Role.ADMIN_PERM:
        prefix = "🛡️ ";
        chatColor = 0x00FF00;
        break;
    default:
        prefix = "🆕 ";
        chatColor = 0xFFFFFF;
}
}

    // Verificar si el jugador está muteado
    if (mutedPlayers.has(player.id)) {
        const muteData = mutedPlayers.get(player.id);
        const timeLeft = Math.ceil((muteData.until - Date.now()) / 60000);
        
        if (timeLeft > 0) {
            room.sendAnnouncement(`❌ Estás muteado por ${timeLeft} minutos más.`, player.id, 0xFF0000);
            return false;
        } else {
            mutedPlayers.delete(player.id);
        }
    }

    // Comando para reiniciar partido
    if (message === "!rr") {
        return handleReinicioComando(player);
    }
    
    // Sistema de picks - versión mejorada para iniciar partido al terminar
    if (inChooseMode && TeamR.length != 0 && TeamB.length != 0) {
        console.log("Procesando mensaje en modo elección:", message, "de jugador:", player.name);
        
        // Verificar si es el capitán de algún equipo
        const isRedCaptain = TeamR.length > 0 && player.id === TeamR[0].id;
        const isBlueCaptain = TeamB.length > 0 && player.id === TeamB[0].id;
        
        // Determinar si es el turno del capitán para elegir
        const isRedTurn = TeamR.length <= TeamB.length;
        const isBlueTurn = TeamB.length < TeamR.length;
        
        if ((isRedTurn && isRedCaptain) || (isBlueTurn && isBlueCaptain)) {
            // Variables para procesar la elección
            let choiceMade = false;
            let chosenPlayer = null;
            let targetTeam = isRedCaptain ? Team.RED : Team.BLUE;
            
            // Si el mensaje es un número
            if (/^\d+$/.test(message.trim())) {
                const choice = parseInt(message) - 1;
                if (choice >= 0 && choice < teamS.length) {
                    chosenPlayer = teamS[choice];
                    choiceMade = true;
                } else {
                    room.sendAnnouncement(`⚠️ Número inválido. Elige entre 1 y ${teamS.length}`, player.id, 0xFF0000);
                    return false;
                }
            }
            // Si el mensaje es 'top'
            else if (message.toLowerCase() === 'top' && teamS.length > 0) {
                chosenPlayer = teamS[0];
                choiceMade = true;
            }
            // Si el mensaje es 'random'
            else if (message.toLowerCase() === 'random' && teamS.length > 0) {
                const randomIndex = Math.floor(Math.random() * teamS.length);
                chosenPlayer = teamS[randomIndex];
                choiceMade = true;
            }
            // Si el mensaje es 'bottom'
            else if (message.toLowerCase() === 'bottom' && teamS.length > 0) {
                const lastIndex = teamS.length - 1;
                chosenPlayer = teamS[lastIndex];
                choiceMade = true;
            }
               
            if (message.toLowerCase() === "!afk") {
                if (getAFK(player)) {
                    // Quitar AFK
                    setAFK(player, false);
                    setActivity(player, Date.now());
                    
                    // Restaurar rol original
                    if (player.originalRole !== undefined) {
                        setPlayerRole(player, player.originalRole);
                        player.originalRole = undefined;
                        room.sendChat("✅ " + player.name + " ya no está AFK", null, 0x00FF00);
                    }
                } else {
                    // Poner AFK
                    setAFK(player, true);
                    setActivity(player, Date.now());
                    
                    // Guardar rol original ANTES de cambiarlo a AFK
                    player.originalRole = getRole(player);
                    console.log("Guardando rol original:", player.originalRole);
                    
                    // Cambiar a rol AFK
                    setPlayerRole(player, Role.AFK);
                    room.sendChat("💤 " + player.name + " está AFK", null, 0xAAAAAA);
                }
                return false;
            }

            
            // Si se hizo una elección válida
            if (choiceMade && chosenPlayer) {
                clearTimeout(timeOutCap); // Limpiamos el timeout
                
                // Movemos al jugador al equipo correspondiente
                room.setPlayerTeam(chosenPlayer.id, targetTeam);
                
                // Anunciamos la elección
                room.sendAnnouncement(`${player.name} eligió a ${chosenPlayer.name}${message.toLowerCase() === 'top' ? ' (top)' : message.toLowerCase() === 'bottom' ? ' (bottom)' : message.toLowerCase() === 'random' ? ' (random)' : ''}`, 
                    null, targetTeam === Team.RED ? 0xFF0000 : 0x0000FF);
                
                // Actualizamos los equipos
                updateTeams();
                
                // Verificamos si continuamos o terminamos
                setTimeout(() => {
                    // Si los equipos están equilibrados
                    if (TeamR.length === TeamB.length) {
                        if (teamS.length >= 2 && TeamR.length < maxTeamSize) {
                            // Aún hay jugadores para elegir y espacio en los equipos
                            choosePlayer(); // Llamar a la siguiente selección
                        } else {
                       // En onPlayerChat, donde se maneja la completación de la selección:

// Equipos están equilibrados o no hay más jugadores para elegir
room.sendAnnouncement("✅ Selección completada. El partido comenzará en unos segundos...", null, 0x00FF00, "bold");

// MODIFICADO: Establecer flag de que acabamos de completar una selección
window.justCompletedSelection = true;
console.log("Selección completada en onPlayerChat, estableciendo flag justCompletedSelection");

// Desactivar modo elección directamente
inChooseMode = false;
blockGameStart = false;

// Limpiar timeouts
clearTimeout(timeOutCap);

// Iniciar partido después de un breve retraso
setTimeout(() => {
console.log("Iniciando partido después de selección");

// Verificar mapa adecuado
updateTeams();
if (TeamR.length + TeamB.length <= 4) {
    loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
} else {
    loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
}

// Iniciar partido
room.startGame();
room.sendAnnouncement("⚽ ¡COMIENZA EL PARTIDO!", null, 0x00FF00, "bold");

// Este flag persistirá durante el ciclo de inicio del juego
// y se reseteará en onGameStart
}, 1500);
                        }
                    } else {
                        // Un equipo tiene más jugadores, continuar selección
                        choosePlayer();
                    }
                }, 1000);
                
                return false;
            }
        }
    }

    // Si el mensaje empieza con "!", es un comando
    if (message.startsWith("!")) {
        const args = message.substring(1).split(" ");
        const command = args.shift().toLowerCase();
   
 
        if (message.toLowerCase() === "!cancelseleccion" && getRole(player) >= Role.ADMIN_PERM) {
            if (inChooseMode) {
                cancelChooseMode("Administrador canceló la selección");
                room.sendAnnouncement(`Administrador ${player.name} canceló el modo de selección`, null, 0xFF9900);
            } else {
                room.sendAnnouncement("No hay un modo de selección activo para cancelar", player.id, 0xFF0000);
            }
            return false;
        }
        
        if (message.toLowerCase() === "!activarseleccion" && getRole(player) >= Role.ADMIN_PERM) {
            if (!inChooseMode) {
                activateChooseMode();
                room.sendAnnouncement(`Administrador ${player.name} activó el modo de selección`, null, 0x00FF00);
            } else {
                room.sendAnnouncement("El modo de selección ya está activo", player.id, 0xFF0000);
            }
            return false;
        }
        
        if (message.toLowerCase() === "!continuarseleccion" && getRole(player) >= Role.ADMIN_PERM) {
            if (inChooseMode) {
                choosePlayer();
                room.sendAnnouncement(`Administrador ${player.name} continuó el proceso de selección`, null, 0x00FF00);
            } else {
                room.sendAnnouncement("No hay un modo de selección activo", player.id, 0xFF0000);
                room.sendAnnouncement("¿Quieres activarlo? Usa !activarseleccion", player.id, 0xFF0000);
            }
            return false;
        }
        

// Comandos de categorías de camisetas
switch(command) {
    case 'uefa':
        UEFAFun(player);
        return false;
    case 'conmebol':
        CONMEBOLFun(player);
        return false;
    case 'concacaf':
        CONCACAFFun(player);
        return false;
    case 'paises':
        PaisesFun(player);
        return false;
    case 'fantasmas':
        FantasmasFun(player);
        return false;
    case 'amateurs':
        EquiposAmateursFun(player);
        return false;
    case 'superheroes':
        SuperHeroesFun(player);
        return false;
    case 'primera':
        SuperligaFun(player);
        return false;
    case 'ascenso':
        AscensoFun(player);
        return false;
    case 'brasileirao':
        BrasilLeagueFun(player);
        return false;
    case 'premierleague':
        PremierLeagueFun(player);
        return false;
    case 'bundesliga':
        BundesligaFun(player);
        return false;
    case 'seriea':
        SerieATIMFun(player);
        return false;
    case 'serieb':
        SerieBItaliaFun(player);
        return false;
    case 'laliga':
        LaLigaFun(player);
        return false;
    case 'ligue1':
        Ligue1Fun(player);
        return false;
    case 'eredivisie':
        EredivisieFun(player);
        return false;
    case 'primeiraliga':
        PrimeiraLigaFun(player);
        return false;
    case 'superlig':
        SuperLigFun(player);
        return false;
    case 'campeonatoruso':
        CampeonatoRusoFun(player);
        return false;
    case 'premierucrania':
        PremierUcranianaFun(player);
        return false;
    case 'superligasuiza':
        RaiffeisenSuperLeagueFun(player);
        return false;
    case 'ligamx':
        LigaMXFun(player);
        return false;
    case 'mls':
        MLSFun(player);
        return false;
    case 'campeonatouruguayo':
        LigaUruguayaFun(player);
        return false;
    case 'ligaaguila':
        LigaAguilaFun(player);
        return false;
    case 'ligaparaguaya':
        LigaParaguayaFun(player);
        return false;
    case 'ligaaguila':
        LigaAguilaFun(player);
        return false;
    case 'ligapro':
        LigaProFun(player);
        return false;
    case 'liga1peru':
        Liga1PeruFun(player);
        return false;
    case 'campeonatochileno':
        CampeonatoChilenoFun(player);
        return false;
    case 'ligaboliviana':
        LigaBolivianaFun(player);
        return false;
    case 'ligavenezolana':
        LigaVenezolanaFun(player);
        return false;
    case 'esports':
        EquiposEsportsFun(player);
        return false;
}

// Si es el comando !camisetas
if (command === 'camisetas') {
CamisetasFun(player);
return false;
}

// Verificamos si es un comando de camiseta (riv1, riv2, riv3)
if (command.match(/^[a-z]+\d+$/)) {
const equipo = command.replace(/\d+$/, ''); // Extrae 'riv' de 'riv1'
const numero = command.slice(-1); // Extrae '1' de 'riv1'
const tipo = numero === '1' ? 'titular' : 
            numero === '2' ? 'alternativa' : 'tercera';
const colorEquipo = player.team === Team.RED ? 'red' : 'blue';
const claveCompleta = `${equipo}/${tipo}/${colorEquipo}`;

console.log("Intentando aplicar camiseta:", claveCompleta);

if (asignarCamisetaPorClave(claveCompleta)) {
    room.sendAnnouncement(
        `✅ ${player.name} aplicó la camiseta ${camisetasEquipos[claveCompleta].nombreEquipo}`,
        null,
        0x00FF00,
        "bold",
        2
    );
    return false;
}
}

// Verificamos si es un comando completo (riv/titular/red)
if (command.includes('/')) {
if (asignarCamisetaPorClave(command)) {
    room.sendAnnouncement(
        `✅ ${player.name} aplicó la camiseta ${camisetasEquipos[command].nombreEquipo}`,
        null,
        0x00FF00,
        "bold",
        2
    );
    return false;
}
}

        if (message.toLowerCase() === "!comenzarpartido" && getRole(player) >= Role.ADMIN_PERM) {
            if (inChooseMode) {
                finishChooseMode("Administrador inició el partido");
                room.sendAnnouncement(`Administrador ${player.name} finalizó la selección e inició el partido`, null, 0x00FF00);
            } else {
                // Si no estamos en modo selección, simplemente iniciamos el juego
                if (room.getScores() === null) {
                    room.startGame();
                    room.sendAnnouncement("⚽ ¡COMIENZA EL PARTIDO!", null, 0x00FF00, "bold");
                } else {
                    room.pauseGame(false);
                    room.sendAnnouncement("⚽ ¡SE REANUDA EL PARTIDO!", null, 0x00FF00, "bold");
                }
            }
            return false;
        }

        if (comandosCamisetas[comando]) {
            // Obtenemos el equipo del jugador
            const equipoJugador = player.team;
            const colorEquipo = equipoJugador === Team.RED ? 'red' : 'blue';
            
            // Obtenemos el número de camiseta (1, 2 o 3)
            const numeroCamiseta = comando.slice(-1);
            const tipoCamiseta = numeroCamiseta === '1' ? 'titular' : 
                                numeroCamiseta === '2' ? 'alternativa' : 'tercera';
            
            // Construimos la clave completa
            const equipo = comandosCamisetas[comando];
            const claveCompleta = `${equipo}/${tipoCamiseta}/${colorEquipo}`;
            
            if (asignarCamisetaPorClave(claveCompleta)) {
                room.sendAnnouncement(
                    `✅ ${player.name} aplicó la camiseta ${camisetasEquipos[claveCompleta].nombreEquipo}`,
                    null,
                    0x00FF00,
                    "bold",
                    2
                );
                return false;
            }
        }
        // Comando de inicio rápido
        if (message === "!start" && getRole(player) >= Role.ADMIN_PERM) {
            room.sendAnnouncement("🚀 Forzando inicio del partido", null, 0x00FF00, "bold");
            inChooseMode = false;
            blockGameStart = false;
            
            // Cargar mapa adecuado
            updateTeams();
            quickRestart();
            if (TeamR.length + TeamB.length <= 4) {
                loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
            } else {
                loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
            }
            
            // Iniciar juego directamente
            room.startGame();
            return false;
        }

        // Comandos AFK
        if (command === "afk") {
            if (players.length != 1 && player.team != Team.SPECTATORS) {
                if (player.team == Team.RED && streak > 0 && room.getScores() == null) {
                    room.setPlayerTeam(player.id, Team.SPECTATORS);
                } else {
                    room.sendAnnouncement("You can't go AFK while playing!", player.id, 0xFF7B08);
                    return false;
                }
            } else if (players.length == 1 && !getAFK(player)) {
                room.setPlayerTeam(player.id, Team.SPECTATORS);
            }
            setAFK(player, !getAFK(player));
            room.sendAnnouncement(player.name + (getAFK(player) ? "   ahora está AFK." : " Ya no estás AFK!"), null, (getAFK(player) ? 0xFF7B08 : 0x8FFF8F));
            getAFK(player) ? updateRoleOnPlayerOut() : updateRoleOnPlayerIn();
            localStorage.getItem(getAuth(player)) ? stats = JSON.parse(localStorage.getItem(getAuth(player))) : stats = [0, 0, 0, 0, "0.00", 0, 0, 0, 0, "0.00", "player"];
            setTimeout(() => {
                if (getAFK(player) && stats[Ss.RL] != "vip") {
                    room.kickPlayer(player.id, "AFK timeout", false)
                }
            }, 30 * 60 * 1000)
            return false;
        } else if (command === "afks" || command === "afklist") {
            var cstm = "[PV] AFK List : ";
            for (var i = 0; i < extendedP.length; i++) {
                if (room.getPlayer(extendedP[i][eP.ID]) != null && getAFK(room.getPlayer(extendedP[i][eP.ID]))) {
                    if (140 - cstm.length < (room.getPlayer(extendedP[i][eP.ID]).name + ", ").length) {
                        room.sendChat(cstm, player.id);
                        cstm = "... ";
                    }
                    cstm += room.getPlayer(extendedP[i][eP.ID]).name + ", ";
                }
            }
            if (cstm == "[PV] LAFK List: ") {
                room.sendChat("[PV] There is no one on the AFK list!", player.id);
                return false;
            }
            cstm = cstm.substring(0, cstm.length - 2);
            cstm += ".";
            room.sendChat(cstm, player.id);
            return false;
        }
        
        // Otros comandos
        if (commands.hasOwnProperty(command)) {
            return commands[command](player, args);
        }
    }

    // Chat de admin (ac o !ac)
    if (message.startsWith('ac ') || message.startsWith('!ac ')) {
        const role = getRole(player);
        if (!role) return false; // Si no hay rol, salir

        if (role >= Role.ADMIN_PERM) {
            const adminMessage = message.substr(message.indexOf(' ') + 1);
            // Enviamos el mensaje solo a los admins
            room.getPlayerList().forEach((p) => {
                if (!p) return; // Saltar si el jugador es null
                
                const pRole = getRole(p);
                if (!pRole) return; // Saltar si no tiene rol

                if (pRole >= Role.ADMIN_PERM) {
                    let prefix = "";
                    // Agregamos prefijos según el rol
                    switch (role) {
                        case Role.MASTER:
                            prefix = "👑 ";
                            break;
                        case Role.OWNER:
                            prefix = "👑 ";
                            break;
                        case Role.CO_OWNER:
                            prefix = "⭐ ";
                            break;
                        case Role.SUPERADMIN:
                            prefix = "🔰 ";
                            break;
                        case Role.ADMIN_PERM:
                            prefix = "🛡️ ";
                            break;
                        default:
                            prefix = "";
                    }
                    room.sendAnnouncement(`[CHAT ADMIN] ${prefix}${player.name}: ${adminMessage}`, p.id, 0xb201ff, "bold", 2);
                }
            });
            return false;
        } else {
            room.sendAnnouncement("❌ No tenés permisos para usar el chat de admins.", player.id, 0xFF0000);
            return false;
        }
    }

    // Mensajes privados (@@nombre o @@#ID)
    if (message.startsWith('@@')) {
        const msgParts = message.substring(2).split(' '); // Removemos los @@
        if (msgParts.length < 2) {
            room.sendAnnouncement("❌ Uso: @@nombre mensaje o @@#ID mensaje", player.id, 0xFF0000);
            return false;
        }

        let targetPlayer = null;
        const targetMsg = msgParts.slice(1).join(' ');

        // Si es un ID (#número)
        if (msgParts[0].startsWith('#')) {
            const targetId = parseInt(msgParts[0].substring(1));
            targetPlayer = room.getPlayer(targetId);
        } else {
            // Buscar jugador por nombre
            targetPlayer = findClosestPlayer(msgParts[0], player.id);
        }

        if (!targetPlayer) {
            room.sendAnnouncement("❌ Jugador no encontrado. Asegurate de escribir bien el nombre o usar #ID", player.id, 0xFF0000);
            return false;
        }

        if (targetPlayer.id === player.id) {
            room.sendAnnouncement("❌ No podés enviarte mensajes a vos mismo", player.id, 0xFF0000);
            return false;
        }

        // Color cyan para mensajes privados
        const mpColor = 0x00FFFF;

        // Enviamos el mensaje al remitente
        room.sendAnnouncement(`[MP➡️] Para ➡️ ${targetPlayer.name}: ${targetMsg}`, 
            player.id, mpColor, "bold", 1);

        // Enviamos el mensaje al destinatario
        room.sendAnnouncement(`[MP⬅️] ${player.name} ➡️ Dice: ${targetMsg}`, 
            targetPlayer.id, mpColor, "bold", 1);

        // Enviamos a los admins espiando
        room.getPlayerList().forEach((p) => {
            if (spyingAdmins.has(p.id) && p.id !== player.id && p.id !== targetPlayer.id) {
                room.sendAnnouncement(`[SPY-MP] ${player.name} ➡️ ${targetPlayer.name}: ${targetMsg}`, 
                    p.id, 0xFF4C4C, "bold", 1);
            }
        });

        return false;
    }

    // Chat de equipo
    if (message.length > 1 && message[0].toLowerCase() == 't' && message[1] == ' ') {
        let { prefix, chatColor } = getChatFormat(player);
        
        if (player.team == Team.RED) {
            room.getPlayerList().forEach((element) => {
                if (element.team == Team.RED || spyingAdmins.has(element.id)) {
                    const isSpy = element.team !== Team.RED && spyingAdmins.has(element.id);
                    const spyPrefix = isSpy ? "[SPY-RED] " : "";
                    room.sendAnnouncement(`${spyPrefix}🔴 [TEAM RED] ${prefix}${player.name}: ${message.substr(2)}`, 
                        element.id, isSpy ? 0xFF4C4C : chatColor, "bold", 0);
                }
            });
            return false;
        }
        else if (player.team == Team.BLUE) {
            room.getPlayerList().forEach((element) => {
                if (element.team == Team.BLUE || spyingAdmins.has(element.id)) {
                    const isSpy = element.team !== Team.BLUE && spyingAdmins.has(element.id);
                    const spyPrefix = isSpy ? "[SPY-BLUE] " : "";
                    room.sendAnnouncement(`${spyPrefix}🔵 [TEAM BLUE] ${prefix}${player.name}: ${message.substr(2)}`, 
                        element.id, isSpy ? 0xFF4C4C : chatColor, "bold", 0);
                }
            });
            return false;
        }
        else if (player.team == Team.SPECTATORS) {
            room.getPlayerList().forEach((element) => {
                if (element.team == Team.SPECTATORS || spyingAdmins.has(element.id)) {
                    const isSpy = element.team !== Team.SPECTATORS && spyingAdmins.has(element.id);
                    const spyPrefix = isSpy ? "[SPY-SPEC] " : "";
                    room.sendAnnouncement(`${spyPrefix}👥 [SPEC] ${prefix}${player.name}: ${message.substr(2)}`, 
                        element.id, isSpy ? 0xFF4C4C : chatColor, "bold", 0);
                }
            });
            return false;
        }
    }

    // Chat normal con prefijo según rol
    room.sendAnnouncement(`${prefix}${player.name}: ${message}`, null, chatColor);
    return false;
}


// Función para manejar el login de admins
room.onCommand_loginadm = function(player, password) {
    if (!password) {
        room.sendAnnouncement("❌ Uso: !loginadm <contraseña>", player.id, 0xFF0000);
        return false;
    }

    // Verificar la contraseña para cada rol, empezando por el más alto
    if (password === rolePasswords[Role.MASTER]) {
        setPlayerRole(player, Role.MASTER);
        room.setPlayerAdmin(player.id, true);
        room.sendAnnouncement(`👑 ¡Bienvenido MASTER ${player.name}!`, player.id, 0xFFD700, "bold");
    }
    else if (password === rolePasswords[Role.OWNER]) {
        setPlayerRole(player, Role.OWNER);
        // Quitamos el setPlayerAdmin de aquí
        room.sendAnnouncement(`👑 ¡Bienvenido OWNER ${player.name}!`, player.id, 0xFFD700, "bold");
    }
    else if (password === rolePasswords[Role.CO_OWNER]) {
        setPlayerRole(player, Role.CO_OWNER);
        // Quitamos el setPlayerAdmin de aquí
        room.sendAnnouncement(`👑 ¡Bienvenido CO-OWNER ${player.name}!`, player.id, 0xFFD700, "bold");
    }
    else if (password === rolePasswords[Role.SUPERADMIN]) {
        setPlayerRole(player, Role.SUPERADMIN);
        // Quitamos el setPlayerAdmin de aquí
        room.sendAnnouncement(`⭐ ¡Bienvenido SUPERADMIN ${player.name}!`, player.id, 0xFFD700, "bold");
    }
    else if (password === rolePasswords[Role.ADMIN_PERM]) {
        setPlayerRole(player, Role.ADMIN_PERM);
        // Quitamos el setPlayerAdmin de aquí
        room.sendAnnouncement(`⚡ ¡Bienvenido ADMIN ${player.name}!`, player.id, 0xFFD700, "bold");
    }
    else {
        room.sendAnnouncement("❌ Contraseña incorrecta!", player.id, 0xFF0000);
    }
    return false;
}



room.onPlayerBallKick = function(player) {
    if (lastPlayersTouched[0] == null || player.id != lastPlayersTouched[0].id) {
        !activePlay ? activePlay = true : null;
        lastTeamTouched = player.team;
        lastPlayersTouched[1] = lastPlayersTouched[0];
        lastPlayersTouched[0] = player;
    }
}

/* GAME MANAGEMENT */
room.onGameStart = function(byPlayer) {
    // IMPORTANTE: Agregar un flag para indicar que acabamos de iniciar un partido
    window.lastGameStartTime = Date.now();
    console.log("Partido iniciado a las:", new Date().toISOString());
    
    // Inicializamos el juego y sus variables
    game = new Game(Date.now(), room.getScores(), []);
    game.endGameAnnounced = false; // Flag para evitar múltiples anuncios de fin de juego
    
    // Reseteamos variables de juego
    countAFK = true;
    activePlay = false;
    goldenGoal = false;
    endGameVariable = false;
    lastPlayersTouched = [null, null];
    Rposs = 0;
    Bposs = 0;
    GKList = [null, null]; // Inicializamos con null para evitar errores
    allReds = [];
    allBlues = [];
    
    // Si estamos en modo de elección, cancelarlo correctamente
    if (inChooseMode) {
        console.log("Juego iniciado durante modo selección - cancelando selección");
        // Usamos cancelChooseMode en lugar de deactivateChooseMode
        inChooseMode = false; // Forzar desactivación directa
        blockGameStart = false;
        clearTimeout(timeOutCap); // Limpiar timeouts
    }
    
    // Desbloqueamos el inicio del juego (por si acaso)
    blockGameStart = false;
    
    // Mensajes iniciales según el modo de juego
    if (players.length === 1) {
        room.sendAnnouncement(centerText("🎯 MODO PRÁCTICA ACTIVO 🎯"), null, 0x00FF00, "bold");
        room.sendAnnouncement(centerText("Espera a que se unan 2 jugadores para empezar el partido"), null, 0x00FF00);
    } else {
        room.sendAnnouncement(centerText("⚽ ¡QUE COMIENCE EL PARTIDO! ⚽"), null, Cor.White, "bold");
        
        // Mensajes de uniformes solo si no es modo práctica
        room.sendAnnouncement(centerText("👕 Comandos de uniformes:"), null, 0x2EF55D, "bold");
        room.sendAnnouncement(centerText("!bl Camiseta Negra - !wh Camiseta Blanca"), null, 0x2EF55D);
    }
    
    // Mensaje de chat de equipo para todos los modos
    room.sendAnnouncement(centerText("💬 Usá 't' antes del mensaje para chat de equipo"), null, 0x5EE7FF);
    
    // Actualizamos los equipos
    updateTeams();
    
    // Guardamos los jugadores iniciales si es un partido completo
    if (TeamR.length == maxTeamSize && TeamB.length == maxTeamSize) {
        for (let i = 0; i < maxTeamSize; i++) {
            allReds.push(TeamR[i]);
            allBlues.push(TeamB[i]);
        }
    }
    
    // Reseteamos estadísticas de jugadores
    for (let i = 0; i < extendedP.length; i++) {
        if (room.getPlayer(extendedP[i][eP.ID])) {
            extendedP[i][eP.GK] = 0; // Reseteamos tiempo de portero
            extendedP[i][eP.ACT] = 0; // Reseteamos actividad
        } else {
            extendedP.splice(i, 1); // Removemos jugadores que ya no están
            i--; // Ajustamos el índice
        }
    }
    
    // MODIFICADO: Solo mostrar mensaje de modo elección si no venimos de un modo elección
    if (players.length >= 2 * maxTeamSize && !window.justCompletedSelection) {
        room.sendAnnouncement(centerText("👥 Modo elección disponible para el próximo partido"), null, 0x30F55F);
    }
    
    // Resetear flag (si existiera)
    window.justCompletedSelection = false;
    
    // Log para depuración
    console.log("Partido iniciado correctamente");
}
room.onGameStop = function(byPlayer) {
    try {
        // IMPORTANTE: Verificar si el juego acaba de ser iniciado (menos de 5 segundos)
        const gameJustStarted = window.lastGameStartTime && (Date.now() - window.lastGameStartTime < 5000);
        
        console.log("Juego detenido por:", byPlayer ? byPlayer.name : "sistema", 
                   "- Tiempo desde inicio:", window.lastGameStartTime ? (Date.now() - window.lastGameStartTime) / 1000 : "desconocido", "segundos");
        
        // Si el juego acaba de iniciar (posiblemente como parte de un reinicio post-selección)
        // y justCompletedSelection está activo, no hacemos nada más
        if (gameJustStarted && window.justCompletedSelection) {
            console.log("Juego detenido justo después de ser iniciado por selección - ignorando eventos");
            return;
        }
        
        // Si estamos en modo de elección, verificar si debemos cancelarlo
        if (inChooseMode) {
            // Si fue detenido por un administrador, mantenemos el modo de selección
            if (byPlayer && getRole(byPlayer) >= Role.ADMIN_PERM) {
                console.log("Juego detenido por admin durante selección - manteniendo modo");
                room.sendAnnouncement("El juego fue detenido pero el modo de selección continúa", null, 0xFF9900);
            } else {
                // Si fue un stop automático o por un jugador normal, cancelamos la selección
                console.log("Juego detenido durante selección - cancelando selección");
                inChooseMode = false; // Forzar desactivación directa
                blockGameStart = false;
                clearTimeout(timeOutCap);
            }
        }
        
        // Si byPlayer es null, asumimos que el juego terminó normalmente
        if (!byPlayer) {
            updateTeams();
            const players = room.getPlayerList();
            const activePlayers = players.filter(p => !getAFK(p));
            
            // Verificar si debemos cambiar el mapa según la cantidad de jugadores
            if (activePlayers.length >= 6) {
                console.log("Cargando bigMap después del partido (6+ jugadores)");
                loadMap(bigMap, scoreLimitPractice, timeLimitPractice);
            } else if (activePlayers.length >= 2) {
                console.log("Cargando classicMap después del partido (2-5 jugadores)");
                loadMap(classicMap, scoreLimitPractice, timeLimitPractice);
            }
            
            if (inChooseMode) {
                if (players.length == 2 * maxTeamSize) {
                    inChooseMode = false;
                    resetBtn();
                    for (var i = 0; i < maxTeamSize; i++) {
                        setTimeout(() => {
                            randomBtn();
                        }, 400 * i);
                    }
                    setTimeout(() => {
                        // Verificamos que podemos iniciar el juego
                        if (safeStartGame()) {
                            room.startGame();
                        }
                    }, 2000);
                } else {
                    if (lastWinner == Team.RED) {
                        blueToSpecBtn();
                    } else if (lastWinner == Team.BLUE) {
                        redToSpecBtn();
                        blueToRedBtn();
                    } else {
                        resetBtn();
                    }
                    setTimeout(() => {
                        topBtn();
                    }, 500);
                }
            } else {
                // Caso específico: exactamente 6 jugadores activos
                if (activePlayers.length == 6 && teamS.length == 0) {
                    console.log("Exactamente 6 jugadores sin espectadores - distribuyendo automáticamente");
                    resetBtn();
                    setTimeout(() => {
                        randomBtn();
                        setTimeout(() => {
                            randomBtn();
                            setTimeout(() => {
                                randomBtn();
                            }, 10);
                        }, 10);
                    }, 10);
                    setTimeout(() => {
                        // Verificamos que podemos iniciar el juego
                        if (safeStartGame()) {
                            room.startGame();
                        }
                    }, 1000);
                    return;
                }
                
                // Para otros casos, seguir con la lógica normal
                if (players.length == 2) {
                    if (lastWinner == Team.BLUE) {
                        if (TeamB[0] && TeamR[0]) {
                            room.setPlayerTeam(TeamB[0].id, Team.RED);
                            room.setPlayerTeam(TeamR[0].id, Team.BLUE);
                        }
                    }
                    setTimeout(() => {
                        // Verificamos que podemos iniciar el juego
                        if (safeStartGame()) {
                            room.startGame();
                        }
                    }, 2000);
                } else if (players.length == 3 || players.length >= 2 * maxTeamSize + 1) {
                    if (lastWinner == Team.RED) {
                        blueToSpecBtn();
                    } else {
                        redToSpecBtn();
                        blueToRedBtn();
                    }
                    setTimeout(() => {
                        topBtn();
                    }, 200);
                    
                    // IMPORTANTE: Activar modo de elección SOLO si hay espectadores activos
                    // y si no venimos de haber completado una selección
                    const activeSpecs = teamS.filter(p => !getAFK(p));
                    if (activeSpecs.length > 0 && !window.justCompletedSelection) {
                        console.log("Hay espectadores activos disponibles, activando modo de elección");
                        setTimeout(() => {
                            activateChooseMode();
                        }, 300);
                    } else {
                        setTimeout(() => {
                            // Verificamos que podemos iniciar el juego
                            if (safeStartGame()) {
                                room.startGame();
                            }
                        }, 2000);
                    }
                } else if (players.length == 4) {
                    resetBtn();
                    setTimeout(() => {
                        randomBtn();
                        setTimeout(() => {
                            randomBtn();
                        }, 500);
                    }, 500);
                    setTimeout(() => {
                        // Verificamos que podemos iniciar el juego
                        if (safeStartGame()) {
                            room.startGame();
                        }
                    }, 2000);
                } else if (players.length == 5) {
                    if (lastWinner == Team.RED) {
                        blueToSpecBtn();
                    } else {
                        redToSpecBtn();
                        blueToRedBtn();
                    }
                    setTimeout(() => {
                        topBtn();
                    }, 200);
                    
                    // Activar modo de elección para 5 jugadores (2v2 + 1 spec)
                    // Solo si no venimos de completar una selección
                    if (!window.justCompletedSelection) {
                        console.log("5 jugadores, activando modo de elección");
                        setTimeout(() => {
                            activateChooseMode();
                        }, 300);
                    } else {
                        setTimeout(() => {
                            // Verificamos que podemos iniciar el juego
                            if (safeStartGame()) {
                                room.startGame();
                            }
                        }, 2000);
                    }
                } else if (players.length >= 6) {
                    // Caso para 6+ jugadores con espectadores
                    resetBtn();
                    
                    // IMPORTANTE: Activar modo de elección SOLO si hay espectadores activos después de un partido
                    // y si no venimos de completar una selección
                    const activeSpecs = teamS.filter(p => !getAFK(p));
                    if (activeSpecs.length > 0 && lastWinner != undefined && !window.justCompletedSelection) {
                        console.log("Hay espectadores activos después de un partido, activando modo de elección");
                        
                        // Si hubo un ganador, sacar al equipo perdedor
                        if (lastWinner == Team.RED) {
                            blueToSpecBtn();
                        } else if (lastWinner == Team.BLUE) {
                            redToSpecBtn();
                            blueToRedBtn();
                        }
                        
                        setTimeout(() => {
                            activateChooseMode();
                        }, 500);
                    } else {
                        // Si no hay espectadores o es el primer partido, distribuir automáticamente
                        console.log("Distribuyendo jugadores automáticamente para 3v3");
                        
                        // Distribuir 3 jugadores por equipo
                        for (var i = 0; i < 3; i++) {
                            setTimeout(() => {
                                randomBtn();
                            }, 200 * i);
                        }
                        
                        setTimeout(() => {
                            // Verificamos que podemos iniciar el juego
                            if (safeStartGame()) {
                                room.startGame();
                            }
                        }, 1000);
                    }
                }
            }
            return;
        }

        // Si byPlayer existe, verificamos su id
        if (byPlayer.id == 0) {
            // Mantener lógica existente pero añadiendo la verificación de justCompletedSelection
            updateTeams();
            const players = room.getPlayerList();
            const activePlayers = players.filter(p => !getAFK(p));
            
            // ... (código igual al caso de byPlayer null pero con mismas protecciones)
        }
    } catch (error) {
        console.error("Error en onGameStop:", error);
    }
}

room.onGameUnpause = function(byPlayer) {
    if (TeamR.length == 4 && TeamB.length == 4 && inChooseMode || (TeamR.length == TeamB.length && teamS.length < 2 && inChooseMode)) {
        deactivateChooseMode();
    }
}

room.onTeamGoal = function(team) {
    try {
        teamgoaler = team;
        let assistencia = "";
        let goleador = "";
        let goalMaker = lastPlayersTouched[0]?.id;
        activePlay = false;
        countAFK = false;
        const scores = room.getScores();
        game.scores = scores;

        // Gol normal
        if (lastPlayersTouched[0] != null && lastPlayersTouched[0].team == team) {
            // Con asistencia
            if (lastPlayersTouched[1] != null && lastPlayersTouched[1].team == team) {
                // Obtener información para el mensaje
                const scorer = lastPlayersTouched[0].name;
                const assist = lastPlayersTouched[1].name;
                const rivalTeam = team == Team.RED ? "AZUL" : "ROJO";
                
                // Obtener info del arquero de manera segura
                const gkPlayer = getGK(team == Team.RED ? Team.BLUE : Team.RED);
                const gk = gkPlayer ? gkPlayer.name : "el arquero";

                // Anuncios del gol
                room.sendAnnouncement(centerText("🎵 ¡GOOOOOL! 🎵"), null, Cor.Verde, "bold");
                room.sendAnnouncement(centerText(getRandomMessage(scorerMessages, {
                    scorer: scorer,
                    gk: gk,
                    rivalTeam: rivalTeam
                })), null, Cor.White, "bold");
                room.sendAnnouncement(centerText(`👟 Asistencia: ${assist} 👟`), null, Cor.White, "bold");
                room.sendAnnouncement(centerText(`Velocidad del tiro: ${ballSpeed.toPrecision(4).toString()} km/h`), null, Cor.White, "normal");
                
                // Registrar el gol
                game.goals.push(new Goal(scores.time, team, lastPlayersTouched[0], lastPlayersTouched[1]));

                // Animación del goleador
                if (goalMaker != null) {
                    setTimeout(function () {
                        room.setPlayerAvatar(goalMaker, "🎯")
                        setTimeout(function () {
                            room.setPlayerAvatar(goalMaker, "⚽")
                            setTimeout(function () {
                                room.setPlayerAvatar(goalMaker, null)
                            }, 3000);
                        }, 1200);
                    }, 1);
                }

                // Animación del asistente
                if (lastPlayersTouched[1] != null) {
                    let goalAssist = lastPlayersTouched[1].id;
                    assistencia = lastPlayersTouched[1];
                    setTimeout(function () {
                        room.setPlayerAvatar(goalAssist, "🤝")
                        setTimeout(function () {
                            room.setPlayerAvatar(goalAssist, "👟")
                            setTimeout(function () {
                                room.setPlayerAvatar(goalAssist, null)
                            }, 2500);
                        }, 1000);
                    }, 1);
                }
            }
            // Sin asistencia
            else {
                const scorer = lastPlayersTouched[0].name;
                const rivalTeam = team == Team.RED ? "AZUL" : "ROJO";
                const gkPlayer = getGK(team == Team.RED ? Team.BLUE : Team.RED);
                const gk = gkPlayer ? gkPlayer.name : "el arquero";

                room.sendAnnouncement(centerText("🎵 ¡GOOOOOL! 🎵"), null, Cor.Verde, "bold");
                room.sendAnnouncement(centerText(getRandomMessage(scorerMessages, {
                    scorer: scorer,
                    gk: gk,
                    rivalTeam: rivalTeam
                })), null, Cor.White, "bold");
                room.sendAnnouncement(centerText(`Velocidad del tiro: ${ballSpeed.toPrecision(4).toString()} km/h`), null, Cor.White, "normal");
                
                game.goals.push(new Goal(scores.time, team, lastPlayersTouched[0], null));

                // Animación del goleador
                if (goalMaker != null) {
                    setTimeout(function () {
                        room.setPlayerAvatar(goalMaker, "🎯")
                        setTimeout(function () {
                            room.setPlayerAvatar(goalMaker, "⚽")
                            setTimeout(function () {
                                room.setPlayerAvatar(goalMaker, null)
                            }, 3000);
                        }, 1200);
                    }, 1);
                }
            }
        }
        // Autogol
        else if (lastPlayersTouched[0] != null) {
            const scorer = lastPlayersTouched[0].name;

            room.sendAnnouncement(centerText("🤦‍♂️ ¡AUTOGOL! 🤦‍♂️"), null, Cor.Yellow, "bold");
            room.sendAnnouncement(centerText(getRandomMessage(ownGoalMessages, {
                scorer: scorer
            })), null, Cor.White, "bold");
            room.sendAnnouncement(centerText(`Velocidad del tiro: ${ballSpeed.toPrecision(4).toString()} km/h`), null, Cor.White, "normal");
            
            game.goals.push(new Goal(scores.time, team, null, null));

            // Animación especial para autogol
            if (goalMaker != null) {
                setTimeout(function () {
                    room.setPlayerAvatar(goalMaker, "🤦‍♂️")
                    setTimeout(function () {
                        room.setPlayerAvatar(goalMaker, "🤡")
                        setTimeout(function () {
                            room.setPlayerAvatar(goalMaker, null)
                        }, 3000);
                    }, 1000);
                }, 1);
            }

            if (lastPlayersTouched[0] != null) {
                golcontra(lastPlayersTouched[0]);
            }
        }

        // Verificar fin del juego
        if (scores.scoreLimit != 0 && (scores.red == scores.scoreLimit || scores.blue == scores.scoreLimit && scores.blue > 0 || goldenGoal == true)) {
            endGame(team);
            goldenGoal = false;
            setTimeout(() => { room.stopGame(); }, 1000);
        }
    } catch (err) {
        console.error("Error en onTeamGoal:", err);
        // Intentar mostrar al menos un mensaje básico de gol
        room.sendAnnouncement(centerText("🎯 ¡GOL!"), null, Cor.Verde, "bold");
    }
}
room.onPositionsReset = function() {
    countAFK = true;
    lastPlayersTouched = [null, null];
}

/* SEVERAL */

room.onRoomLink = function(url) {}

room.onPlayerAdminChange = function(changedPlayer, byPlayer) {
    if (getMute(changedPlayer) && changedPlayer.admin) {
        room.sendChat(changedPlayer.name + " was unmuted.");
        setMute(changedPlayer, false);
    }
    if (byPlayer.id != 0 && localStorage.getItem(getAuth(byPlayer)) && JSON.parse(localStorage.getItem(getAuth(byPlayer)))[Ss.RL] == "admin") {
        room.sendChat("You are not allowed to appoint a player as an administrator!", byPlayer.id);
        room.setPlayerAdmin(changedPlayer.id, false);
    }
}

room.onStadiumChange = function(newStadiumName, byPlayer) {}

room.onGameTick = function() {
    checkTime();
    getLastTouchOfTheBall();
    getStats();
    handleInactivity();
        // Si acaba de terminar un partido y estamos en modo elección
if (inChooseMode && room.getScores() === null) {
    // Verificar si el partido está intentando comenzar automáticamente
    if (room.getGameState().phase === STATE_STARTING) {
        console.log("Evitando inicio automático durante modo elección");
        room.stopGame();
    }
}
}