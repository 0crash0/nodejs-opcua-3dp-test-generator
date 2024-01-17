import DA from "node-opc-da";
DA.OPCServer;

// creates a COM Session from a domain, an username, and a password
let comSession = new Session();
comSession = comSession.createSession(domain, username, password);

// sets a global timeout for connections related to this session
comSession.setGlobalSocketTimeout(timeout);

// create a COM Server from a classid, an IP address and the previously created session
let comServer = new ComServer(clsid, address, comSession);

// star the COM Server
await comServer.init();

/* from the COM Server, we create a instance we'll use to create every other COM related object */
let comObject = await comServer.createInstance();

// with the comObjet created, we create an OPC Server object and call init()
let opcServer = new OPCServer();
await opcServer.init(comObject);