import lineByLine from "n-readlines";
import gcodeToObject from "gcode-json-converter";

export default class TrdPrinter{
    constructor() {
        this.x_home_state=false;
        this.y_home_state=false;
        this.z_home_state=false;

        this.x_home=false;
        this.y_home=false;
        this.z_home=false;

        this.bed_temp=30;
        this.E0_temp=30;
        this.E0_next_temp=30;
        this.bed_next_temp=30;
        /*this.now_pos= {
            x:30,
            y:30,
            z:30
        }
        this.next_pos={
            x:30,
            y:30,
            z:30
        }*/

        this.now_pos=[30,30,30];
        this.next_pos=[30,30,30];
        this.extruder_pos=0;
        this.extruder_next_pos=0;

        this.speed=100;
        this.liner = new lineByLine('CFFFP_Schneekugel.gcode');
        this.line;
        this.lineNumber = 0;

        this.rand_sensor=0;

        this.Mooving_interval;
        this.Homing_interval;
        this.Temp_interval;
        this.Work_interval;
        this.g1Result;
        this.working=false;
        this.lineworking=false;
        this.GcodeLine= "";
    }

    go_homing(){

        if(!this.x_home_state && !this.homing){
            this.next_pos[0] = -100;
            this.homing = true;
            this.Mooving_interval=setInterval(this.go_step.bind(this), 250);
            //console.log(this.Mooving_interval)

        }
        if(!this.x_home_sensor && this.homing && !this.x_home_state && this.next_pos[0]===-100){
            this.rand_sensor = Math.floor(Math.random() * 10)
            console.log("X Rand sensor ");
            if( this.rand_sensor > 5 || this.now_pos[0]<=-100){
                this.x_home_sensor=true;
            }
            console.log(this.rand_sensor)
        }
        if(this.x_home_sensor && this.homing && !this.x_home_state){
            this.now_pos[0]=0;
            this.next_pos[0]=0;
            this.x_home_state=true;
            console.log("X Home!");
            clearInterval(this.Mooving_interval);
            if(!this.y_home_state && this.homing){
                console.log("Homing Y ....")
                this.next_pos[1] = -100;
                this.Mooving_interval=setInterval(this.go_step.bind(this), 250);
            }
        }
        if(!this.y_home_sensor && this.homing && !this.y_home_state && this.next_pos[1]===-100){
            this.rand_sensor = Math.floor(Math.random() * 10)
            console.log("Y Rand sensor");
            if( this.rand_sensor > 5 || this.now_pos[1]<=-100){
                this.y_home_sensor=true;
            }
            console.log(this.rand_sensor)
        }
        if(this.y_home_sensor && this.x_home_sensor && this.homing && !this.y_home_state){
            this.now_pos[1]=0;
            this.next_pos[1]=0;
            this.y_home_state=true;
            console.log("Y Home!");
            clearInterval(this.Mooving_interval);
            if(!this.z_home_state && this.homing){
                this.next_pos[2] = -100;
                this.Mooving_interval=setInterval(this.go_step.bind(this), 250);
            }
        }
        if(!this.z_home_sensor && this.homing && !this.z_home_state && this.next_pos[2]===-100){
            this.rand_sensor = Math.floor(Math.random() * 10);
            console.log("Z Rand sensor");
            if( this.rand_sensor > 5 || this.now_pos[2]<=-100){
                this.z_home_sensor=true;
            }
            console.log(this.rand_sensor)
        }
        if(this.z_home_sensor && this.x_home_sensor && this.y_home_sensor && this.homing && this.next_pos[2]===-100){
            this.now_pos[2]=0;
            this.next_pos[2]=0;
            this.z_home_state=true;
            this.homing=false;
            console.log("Z Home!");
            clearInterval(this.Homing_interval);
            clearInterval(this.Mooving_interval);
            this.start_work();

        }
        console.log("GO HOMING");
    }

     go_step(){
        if(this.now_pos[0]!==this.next_pos[0]){
            if(this.now_pos[0]>this.next_pos[0]){
                this.now_pos[0]--;
            }
            else{
                this.now_pos[0]++;
            }
        }
         if(Math.abs(this.now_pos[0]-this.next_pos[0]) <1){
             this.now_pos[0]=this.next_pos[0];
         }

        if(this.now_pos[1]!==this.next_pos[1]){
            if(this.now_pos[1]>this.next_pos[1]){
                this.now_pos[1]--;
            }
            else{
                this.now_pos[1]++;
            }
        }
         if(Math.abs(this.now_pos[1]-this.next_pos[1]) <1){
             this.now_pos[1]=this.next_pos[1];
         }
        if(this.now_pos[2]!==this.next_pos[2] ){
            if(this.now_pos[2]>this.next_pos[2]){
                this.now_pos[2]=this.now_pos[2]-0.2;
            }
            else{
                this.now_pos[2]=this.now_pos[2]+0.2;
            }
        }
        if(Math.abs(this.now_pos[2]-this.next_pos[2]) <0.2){
            this.now_pos[2]=this.next_pos[2];
        }
        if(this.now_pos[0]===this.next_pos[0]&&this.now_pos[1]===this.next_pos[1]&&this.now_pos[2]===this.next_pos[2] ){
            this.next_pos=this.now_pos;

            clearInterval(this.Mooving_interval);
            //console.log(this.Mooving_interval);
            if(this.lineworking) {
                this.lineworking = false;
            }
        }
        console.log(this.now_pos);
    }

    start_work(){
        this.working=true;
        this.Work_interval=setInterval(this.Gcode_readLine.bind(this),500);
    }
    Gcode_readLine(){
        console.log("readline")
        if(!this.lineworking){
            this.lineworking=true;
            this.line = this.liner.next()
            //console.log('Line ' + this.lineNumber + ': ' + this.line.toString('ascii'));
            this.lineNumber++;
            this.GcodeLine= ""+this.line;
            this.g1Result = gcodeToObject(this.GcodeLine);
            console.log(this.g1Result);
            if(!!this.g1Result.command) {
                /*if (g1Result.command === "G92") {
                     if (g1Result.args.e === 0) {
                         this.extruder_pos = 0;
                     }
                 }*/
                if(this.g1Result.command==="M105" || this.g1Result.command==="M82" || this.g1Result.command==="G21" || this.g1Result.command==="G90" || this.g1Result.command===""){
                    this.lineworking=false;
                }

                if(this.g1Result.command==="G28"){ // HOMING
                    this.lineworking=false;
                }

                if(this.g1Result.command==="G4"){ // PAUSE
                    this.lineworking=false;
                }

                if(this.g1Result.command==="G92"){ // PAUSE
                    this.lineworking=false;
                }

                if(this.g1Result.command==="M117"){ // SHOW STRING ON DISPLAY
                    this.lineworking=false;
                }
                if(this.g1Result.command==="M107"){ // TURN OFF FAN
                    this.lineworking=false;
                }
                if (this.g1Result.command === "M104" || this.g1Result.command === "M109") { //HOTEND
                    if (!!this.g1Result.args.s) {
                        this.E0_next_temp=this.g1Result.args.s;
                        this.Temp_interval=setInterval(this.changeTemp.bind(this), 250);
                    }
                    if (!!this.g1Result.args.r) {
                        this.E0_next_temp=this.g1Result.args.r;
                        this.Temp_interval=setInterval(this.changeTemp.bind(this), 250);
                    }

                }
                if (this.g1Result.command === "M140" || this.g1Result.command === "M190") { //BED
                    if (!!this.g1Result.args.s) {
                        this.bed_next_temp=this.g1Result.args.s;
                        this.Temp_interval=setInterval(this.changeTemp.bind(this), 250);
                    }
                }
                if (this.g1Result.command === "G1" || this.g1Result.command === "G0") {
                    if (!!this.g1Result.args.e) {
                        this.extruder_next_pos = this.g1Result.args.e;
                    }
                    if (!!this.g1Result.args.x) {
                        this.next_pos[0] = this.g1Result.args.x;
                    }
                    if (!!this.g1Result.args.y) {
                        this.next_pos[1] = this.g1Result.args.y;
                    }
                    if (!!this.g1Result.args.z) {
                        this.next_pos[2] = this.g1Result.args.z;
                    }
                    this.Mooving_interval=setInterval(this.go_step.bind(this), 250);
                }
            }
            else{
                this.lineworking=false;
            }



            //console.log(g1Result.args.x);
            //this.Mooving_interval=setInterval(this.go_step.bind(this), 250);

        }

    }
    changeTemp() {
        if(this.E0_temp<this.E0_next_temp || this.bed_temp<this.bed_next_temp){
            if(this.E0_temp<this.E0_next_temp){
                this.E0_temp+=5;
                console.log("E0: ",this.E0_temp);
            }
            if(this.bed_temp<this.bed_next_temp){
                this.bed_temp++;
                console.log("Bed: ",this.bed_temp);
            }

        }
        else{
            this.lineworking=false;
            clearInterval(this.Temp_interval);
        }


    }

    start_homing(){

        if(!this.x_home_state || !this.y_home_state || !this.z_home_state){
            this.Homing_interval=setInterval(this.go_homing.bind(this),2000)
            //this.Homing_interval=setTimeout(this.go_homing.bind(this), 2000);
        }
    }
    runTemp(){
        this.Temp_interval=setInterval(this.changeTemp.bind(this),200)
    }
}






