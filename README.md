# Test data generator for Ziiot platform by opc ua interface or REST API
### simulator of 3d printer and setting parameters at OPC UA and rest api
## docker and kubernetes ready



parameters exported by REST 
(https://YOUR_SERVER/datagen/opc-server-3dpr/getdatajson):

| parameter        | description                                                     |
|------------------|-----------------------------------------------------------------|
| x_home_state     | is x axis home                                                  |
| y_home_state     | is y axis home                                                  |
| z_home_state     | is z axis home                                                  |
| homing           | is printer going home                                           |
| working          | is printer working                                              |
| coordinates      | array of current printer coordinates                            |
| line_work        | current file line                                               |
| filename         | current working file                                            |
| working_line_num | line number of working file                                     |
| bed_temp         | temp of printer bed                                             |
| e0_temp          | temp of extruder tool head                                      |
| extruder         | coordinate of extuder (how much mm of plastic has been exruded) |



### docker image url:
https://hub.docker.com/repository/docker/0crash0/opc-server-3dpr/general


### things for nifi for working on ziiot platform:

| template                | README                                      |
|-------------------------|---------------------------------------------|
| nifi processor template | [3dp_test_gen_template_rest.xml][nifiTplt]  |
| nifi processor group    | [try_to_get_my_rest.json][nifiGrp]          |


### nifi opc ua processors(built has in this repo [nifi-libs][nifiProcsrs]):
https://github.com/linksmart/nifi-opc-ua-bundles  

opc-ua-stack-1.3.343.jar is requiered for building nifi-opcua.nar


[nifiTplt]: <[https://github.com//README.md](https://github.com/0crash0/nodejs-opcua-3dp-test-generator/blob/main/ziiot/nifi_templates/3dp_test_gen_template_rest.xml)https://github.com/0crash0/nodejs-opcua-3dp-test-generator/blob/main/ziiot/nifi_templates/3dp_test_gen_template_rest.xml>
[nifiGrp]: <[https://github.com//README.md](https://github.com/0crash0/nodejs-opcua-3dp-test-generator/blob/main/ziiot/nifi_templates/try_to_get_my_rest.json)https://github.com/0crash0/nodejs-opcua-3dp-test-generator/blob/main/ziiot/nifi_templates/try_to_get_my_rest.json>
[nifiProcsrs]: <[https://github.com//README.md](https://github.com/0crash0/nodejs-opcua-3dp-test-generator/tree/main/nifi-libs)https://github.com/0crash0/nodejs-opcua-3dp-test-generator/tree/main/nifi-libs>
