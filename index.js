import OPCUAServer from "node-opcua-server";
import {DataType, nodesets, OPCUACertificateManager, Variant, VariantArrayType} from "node-opcua";
import  lineByLine from "n-readlines"


var homing = false;
var mooving = false;
var x_home_state=false;
var y_home_state=false;
var z_home_state=false;


var x_home_sensor=false;
var y_home_sensor=false;
var z_home_sensor=false;

var bed_temp=30;
var E0_temp=30;
var E1_temp=30;
var now_pos=[0,0,0]
var next_pos=[0,0,0];
var speed=100;

var Mooving_interval,Homing_interval;
var rand_sensor=0;
function Trdp_homing(){
    if(!x_home_state &&!homing){
        next_pos[0] = -100;
        homing = true;
        Mooving_interval=setInterval(Trdp_moove, 250);
    }
    if(!x_home_sensor && homing && !x_home_state && next_pos[0]===-100){
        rand_sensor = Math.floor(Math.random() * 10)
        console.log("X Rand sensor ");
        if( rand_sensor === 10 || now_pos[0]<=-100){
            x_home_sensor=true;
        }

        console.log(rand_sensor)
    }
    if(x_home_sensor && homing && !x_home_state){
        now_pos[0]=0;
        next_pos[0]=0;
        x_home_state=true;
        console.log("X Home!")
        clearInterval(Mooving_interval)
        if(!y_home_state && homing){
            console.log("Homing Y ....")
            next_pos[1] = -100;
            Mooving_interval=setInterval(Trdp_moove, 250);
        }
    }
    if(!y_home_sensor && homing&& !y_home_state && next_pos[1]===-100){
        rand_sensor = Math.floor(Math.random() * 10)
        console.log("Y Rand sensor");
        if( rand_sensor === 10 || now_pos[1]<=-100){
            y_home_sensor=true;
        }
        console.log(rand_sensor)
    }
    if(y_home_sensor && x_home_sensor && homing && !y_home_state){
        now_pos[1]=0;
        next_pos[1]=0;
        y_home_state=true;
        console.log("Y Home!");
        clearInterval(Mooving_interval)
        if(!z_home_state && homing){
            next_pos[2] = -100;
            Mooving_interval=setInterval(Trdp_moove, 250);
        }
    }
    if(!z_home_sensor && homing&& !z_home_state && next_pos[2]===-100){
        rand_sensor = Math.floor(Math.random() * 10);
        console.log("Z Rand sensor");
        if( rand_sensor === 10 || now_pos[2]<=-100){
            z_home_sensor=true;
        }
        console.log(rand_sensor)
    }
    if(z_home_sensor && x_home_sensor && y_home_sensor && homing && next_pos[2]===-100){
        now_pos[2]=0;
        next_pos[2]=0;
        z_home_state=true;
        homing=false;
        console.log("Z Home!");
        clearInterval(Homing_interval);
    }

}

function Trdp_moove(){
    if(now_pos[0]!==next_pos[0]){
        now_pos[0]--;
    }
    if(now_pos[1]!==next_pos[1]){
        now_pos[1]--;
    }
    if(now_pos[2]!==next_pos[2]){
        now_pos[2]--;
    }
    if(now_pos[0]===next_pos[0]&&now_pos[1]===next_pos[1]&&now_pos[2]===next_pos[2]){
        clearInterval(Mooving_interval)
    }
    console.log(now_pos);
}




let liner = new lineByLine('CFFFP_Schneekugel.gcode');
let line;
let lineNumber = 0;
function Gcode_readLine(){
    if(x_home_state&&y_home_state&&z_home_state){
        line = liner.next()
        console.log('Line ' + lineNumber + ': ' + line.toString('ascii'));
        lineNumber++;
    }
    return ""+line;
}
/*setInterval(Gcode_readLine, 1000);*/

var userManager = {
    isValidUser: function (userName, password) {
        if (userName === "user1" && password === "password1") {
            return true;
        }
        if (userName === "user2" && password === "password2") {
            return true;
        }
        return false;
    }
};
var certMgr = new OPCUACertificateManager({
    automaticallyAcceptUnknownCertificate:true
})


let date_var1=new Date();
function changeTemp() {
    bed_temp=bed_temp+10;
    date_var1=new Date()
    if(bed_temp>=1000){
        bed_temp=0;
    }
}

setInterval(changeTemp, 1000);

function constructAddressSpace(server) {

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    const Coords = namespace.addFolder("ObjectsFolder", {
        browseName: "Coordinates"
    });

    const Sensors = namespace.addFolder("ObjectsFolder", {
        browseName: "Sensors"
    });
    const WRKfile = namespace.addFolder("ObjectsFolder", {
        browseName: "Work file"
    });



    const nodeVariable1 = namespace.addVariable({
        componentOf: Coords,
        browseName: "Current Coordinates",
        dataType: "Double",
        arrayDimensions: [3],
        accessLevel: "CurrentRead | CurrentWrite",
        userAccessLevel: "CurrentRead | CurrentWrite",
        valueRank: 1,
        value: {
            get: () => {
                return new Variant({dataType: DataType.Double,
                    arrayType: VariantArrayType.Array,
                    value: now_pos});
            }
        }

    });

    const XHMnodeVariable = namespace.addVariable({
        componentOf: Coords,
        browseName: "X Home State",
        dataType: "Boolean",
        value: {
            get: () => {
                return new Variant({dataType: DataType.Boolean, value: x_home_state});
            }
        }
    });
    const YHMnodeVariable = namespace.addVariable({
        componentOf: Coords,
        browseName: "Y Home State",
        dataType: "Boolean",
        value: {
            get: () => {
                return new Variant({dataType: DataType.Boolean, value: y_home_state});
            }
        }
    });
    const ZHMnodeVariable = namespace.addVariable({
        componentOf: Coords,
        browseName: "Z Home State",
        dataType: "Boolean",
        value: {
            get: () => {
                return new Variant({dataType: DataType.Boolean, value: z_home_state});
            }
        }
    });


    const nodeVariable2 = namespace.addVariable({
        componentOf: Sensors,
        nodeId: "s=E0_Temperature",
        browseName: "E0 Temperature",
        dataType: "Double",
        minimumSamplingInterval: 1000,
        value: {
            get: () => {
                const t = date_var1 / 10000.0;
                const value = bed_temp + 10.0 * Math.sin(t);
                return new Variant({dataType: DataType.Double, value: value});
            }
        }
    });


    const nodeVariable3 = namespace.addVariable({
        componentOf: Sensors,
        nodeId: "s=Bed_Temp",
        browseName: "BedTemp",
        dataType: "Double",
        minimumSamplingInterval: 1000,
        value: {
            get: () => {
                return new Variant({dataType: DataType.Double, value: bed_temp});
            }
        }
    });


    const nodeVariable4 = namespace.addVariable({
        componentOf: WRKfile,
        browseName: "File Command Line",
        dataType: "String",
        minimumSamplingInterval: 1000,
        value: {
            get: () => {
                return new Variant({dataType: DataType.String, value: Gcode_readLine()});
            }
        }
    });
    const nodeVariable5 = namespace.addVariable({
        componentOf: WRKfile,
        browseName: "File Line",
        dataType: "Byte",
        minimumSamplingInterval: 1000,
        value: {
            get: () => {
                return new Variant({dataType: DataType.Byte, value: lineNumber});
            }
        }
    });
}

(async () => {

    try {
        // Let create an instance of OPCUAServer
        const server = new OPCUAServer.OPCUAServer({

            port: 26543,        // the port of the listening socket of the server
            userManager: userManager,

            allowAnonymous: true,
            nodeset_filename: [
                nodesets.standard,
                nodesets.di
            ],
            buildInfo: {
                productName: "Sample NodeOPCUA Server1",

                buildNumber: "7658",
                buildDate: new Date(2020, 6, 14)
            }
        });

        await server.initialize();

        constructAddressSpace(server);

        // we can now start the server
        await server.start();

        console.log("Server is now listening ... ( press CTRL+C to stop) ");
        server.endpoints[0].endpointDescriptions().forEach(function(endpoint) {
            console.log(endpoint.endpointUrl, endpoint.securityMode.toString(), endpoint.securityPolicyUri.toString());
        });


        process.on("SIGINT", async () => {
            await server.shutdown();
            console.log("terminated");

        });
    } catch (err) {
        console.log(err);
        process.exit(-1);
    }
})();

if(!x_home_state || !y_home_state || !z_home_state){
    Homing_interval=setInterval(Trdp_homing,2000)
}
