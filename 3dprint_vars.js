import lineByLine from "n-readlines";

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
        this.E0_temp_new=255;
        this.bed_temp_new=100;
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

        this.speed=100;
        this.liner = new lineByLine('CFFFP_Schneekugel.gcode');
        this.line;
        this.lineNumber = 0;

        this.rand_sensor=0;

        this.Mooving_interval;
        this.Homing_interval;
        this.Temp_interval;
        this.Work_interval;

        this.working=false;
        this.lineworking=false;
        this.GcodeLine= "";
    }

    go_homing(){

        if(!this.x_home_state && !this.homing){
            this.next_pos[0] = -100;
            this.homing = true;
            this.Mooving_interval=setInterval(this.go_step.bind(this), 250);
            console.log(this.Mooving_interval)

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
            this.now_pos[0]--;
        }
        if(this.now_pos[1]!==this.next_pos[1]){
            this.now_pos[1]--;
        }
        if(this.now_pos[2]!==this.next_pos[2]){
            this.now_pos[2]--;
        }
        if(this.now_pos[0]===this.next_pos[0]&&this.now_pos[1]===this.next_pos[1]&&this.now_pos[2]===this.next_pos[2]){
            clearInterval(this.Mooving_interval);
            console.log(this.Mooving_interval);
        }
        console.log(this.now_pos);
    }

    start_work(){
        this.Work_interval=setInterval(this.Gcode_readLine.bind(this),2000);
    }
    Gcode_readLine(){
        if(!this.lineworking){
            this.lineworking=true;
            this.line = this.liner.next()
            console.log('Line ' + this.lineNumber + ': ' + this.line.toString('ascii'));
            this.lineNumber++;
            this.GcodeLine= ""+this.line;
            this.lineworking=false;
        }

    }
    changeTemp() {
        if(this.E0_temp<this.E0_temp_new){
            this.E0_temp+=1;
        }
        if(this.bed_temp<this.bed_temp_new){
            this.bed_temp+=1;
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






