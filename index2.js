import OPCUAServer from "node-opcua-server";
import {DataType, OPCUACertificateManager, Variant, VariantArrayType} from "node-opcua";
import  lineByLine from "n-readlines"

var x_home=false;
var y_home=false;
var z_home=false;
var bed_temp=30;
var E0_temp=30;
var E1_temp=30;
var now_pos=[30,30,30];
var speed=100;
/*
import fs from "fs";
import * as readline from "readline";
(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('CFFFP_Schneekugel.gcode'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            console.log(`Line from file: ${line}`);
        });

        await events.once(rl, 'close');

        console.log('Reading file line by line with readline done.');
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    } catch (err) {
        console.error(err);
    }
})();
var lineReader = readline.createInterface({
    input: fs.createReadStream('CFFFP_Schneekugel.gcode')
});

lineReader.on('line', function (line) {
    console.log('Line from file:', line);
});

lineReader.on('close', function () {
    console.log('all done, son');
});
*/


let liner = new lineByLine('CFFFP_Schneekugel.gcode');
let line;
let lineNumber = 0;
function Gcode_readLine(){
    line = liner.next()
    console.log('Line ' + lineNumber + ': ' + line.toString('ascii'));
    lineNumber++;
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
const server = new OPCUAServer.OPCUAServer({
    port:26544,
    userManager: userManager,
    alternateHostname: "localhost",
    allowAnonymous: true,
});
await server.start()

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

let date_var1=new Date();

function changeTemp() {
    bed_temp=bed_temp+10;
    date_var1=new Date()
    if(bed_temp>=1000){
        bed_temp=0;
    }
}

setInterval(changeTemp, 1000);

const nodeVariable1 = namespace.addVariable({
    componentOf: Coords,
    browseName: "Current Coordinates",
    dataType: "Double",
    arrayDimensions: [3],
    accessLevel: "CurrentRead | CurrentWrite",
    userAccessLevel: "CurrentRead | CurrentWrite",
    valueRank: 1

});
nodeVariable1.setValueFromSource({
    dataType: DataType.Double,
    arrayType: VariantArrayType.Array,
    value: now_pos
});




const XHMnodeVariable = namespace.addVariable({
    componentOf: Coords,
    browseName: "X Home State",
    dataType: "Boolean",
    value: {
        get: () => {
            return new Variant({ dataType: DataType.Boolean, value: x_home });
        }
    }
});
const YHMnodeVariable = namespace.addVariable({
    componentOf: Coords,
    browseName: "Y Home State",
    dataType: "Boolean",
    value: {
        get: () => {
            return new Variant({ dataType: DataType.Boolean, value: y_home });
        }
    }
});
const ZHMnodeVariable = namespace.addVariable({
    componentOf: Coords,
    browseName: "Z Home State",
    dataType: "Boolean",
    value: {
        get: () => {
            return new Variant({ dataType: DataType.Boolean, value: z_home });
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
            const t =  date_var1/ 10000.0;
            const value = bed_temp + 10.0 * Math.sin(t);
            return new Variant({ dataType: DataType.Double, value: value });
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
            return new Variant({ dataType: DataType.Double, value: bed_temp });
        }
    }
});
var tsttxt="sda"


const nodeVariable4 = namespace.addVariable({
    componentOf: WRKfile,
    browseName: "File Command Line",
    dataType: "String",
    minimumSamplingInterval:1000,
    value: {
        get:()=>{
            return new Variant({ dataType: DataType.String, value: Gcode_readLine() });
        }
    }
});
const nodeVariable5 = namespace.addVariable({
    componentOf: WRKfile,
    browseName: "File Line",
    dataType: "Byte",
    minimumSamplingInterval:1000,
    value:{
        get:()=>{
            return new Variant({ dataType: DataType.Byte, value: lineNumber });
        }
    }
});


console.log("Server is now listening ... ( press CTRL+C to stop) ");
await new Promise((resolve) => process.once("SIGINT",resolve));

await server.shutdown();