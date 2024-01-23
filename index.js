import OPCUAServer from "node-opcua-server";
import {DataType, nodesets, OPCUACertificateManager, Variant, VariantArrayType} from "node-opcua";
import TrdPrinter from "./3dprint_vars.js";
import express from "express"

const app= express();

app.get('/', (req, res) => {
    res.send("Hello World! <a href='/start'>start</a>")
})
app.get('/stop', (req, res) => {
    res.send("<a href='/start'>start</button>")
    my3dprinter.stop_machine();
})
app.get('/start', (req, res) => {
    res.send("<a href='/stop'>stop</a>")
    my3dprinter.start_homing();
})
app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
})

let my3dprinter=new TrdPrinter();



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
                    value: my3dprinter.now_pos});
            }
        }

    });

    const XHMnodeVariable = namespace.addVariable({
        componentOf: Coords,
        browseName: "X Home State",
        dataType: "Boolean",
        value: {
            get: () => {
                return new Variant({dataType: DataType.Boolean, value: my3dprinter.x_home_state});
            }
        }
    });
    const YHMnodeVariable = namespace.addVariable({
        componentOf: Coords,
        browseName: "Y Home State",
        dataType: "Boolean",
        value: {
            get: () => {
                return new Variant({dataType: DataType.Boolean, value: my3dprinter.y_home_state});
            }
        }
    });
    const ZHMnodeVariable = namespace.addVariable({
        componentOf: Coords,
        browseName: "Z Home State",
        dataType: "Boolean",
        value: {
            get: () => {
                return new Variant({dataType: DataType.Boolean, value: my3dprinter.z_home_state});
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
                const value = my3dprinter.E0_temp ;
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
                return new Variant({dataType: DataType.Double, value: my3dprinter.bed_temp});
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
                return new Variant({dataType: DataType.String, value: my3dprinter.GcodeLine});
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
                return new Variant({dataType: DataType.Byte, value: my3dprinter.lineNumber});
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
//my3dprinter.tst_arr()
//my3dprinter.start_homing()

