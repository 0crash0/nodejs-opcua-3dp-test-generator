import lineByLine from "n-readlines";

export default class TrdPrinter{
    x_home_state=false;
    y_home_state=false;
    z_home_state=false;

    x_home=false;
    y_home=false;
    z_home=false;

    bed_temp=30;
    E0_temp=30;
    E1_temp=30;
    now_pos=[30,30,30];
    next_pos=[30,30,30];
    speed=100;
    liner = new lineByLine('CFFFP_Schneekugel.gcode');
    line;
    lineNumber = 0;

    Mooving_interval;
    Homing_interval;
    rand_sensor=0;
    constructor() {
        this.x_home_state=false;
        this.y_home_state=false;
        this.z_home_state=false;

        this.x_home=false;
        this.y_home=false;
        this.z_home=false;

        this.bed_temp=30;
        this.E0_temp=30;
        this.E1_temp=30;
        this.now_pos=new Array([30,30,30]);
        this.next_pos=new Array([30,30,30]);
        this.speed=100;
        this.liner = new lineByLine('CFFFP_Schneekugel.gcode');
        this.line;
        this.lineNumber = 0;

        this.Mooving_interval;
        this.Homing_interval;
        this.rand_sensor=0;
    }
     Trdp_homing(){
        if(!this.x_home_state &&! this.homing){
            this.next_pos[0] = -100;
            this.homing = true;
            this.Mooving_interval=setInterval(this.Trdp_moove, 250);
        }
        if(!this.x_home_sensor && this.homing && !this.x_home_state && this.next_pos[0]===-100){
            this.rand_sensor = Math.floor(Math.random() * 10)
            console.log("X Rand sensor ");
            if( this.rand_sensor === 10 || this.now_pos[0]<=-100){
                this.x_home_sensor=true;
            }

            console.log(this.rand_sensor)
        }
        if(this.x_home_sensor && this.homing && !this.x_home_state){
            this.now_pos[0]=0;
            this.next_pos[0]=0;
            this.x_home_state=true;
            console.log("X Home!")
            clearInterval(this.Mooving_interval)
            if(!this.y_home_state && this.homing){
                console.log("Homing Y ....")
                this.next_pos[1] = -100;
                this.Mooving_interval=setInterval(this.Trdp_moove, 250);
            }
        }
        if(!this.y_home_sensor && this.homing && !this.y_home_state && this.next_pos[1]===-100){
            this.rand_sensor = Math.floor(Math.random() * 10)
            console.log("Y Rand sensor");
            if( this.rand_sensor === 10 || this.now_pos[1]<=-100){
                this.y_home_sensor=true;
            }
            console.log(this.rand_sensor)
        }
        if(this.y_home_sensor && this.x_home_sensor && this.homing && !this.y_home_state){
            this.now_pos[1]=0;
            this.next_pos[1]=0;
            this.y_home_state=true;
            console.log("Y Home!");
            clearInterval(this.Mooving_interval)
            if(!this.z_home_state && this.homing){
                this.next_pos[2] = -100;
                this.Mooving_interval=setInterval(this.Trdp_moove, 250);
            }
        }
        if(!this.z_home_sensor && this.homing && !this.z_home_state && this.next_pos[2]===-100){
            this.rand_sensor = Math.floor(Math.random() * 10);
            console.log("Z Rand sensor");
            if( this.rand_sensor === 10 || this.now_pos[2]<=-100){
                this.z_home_sensor=true;
            }
            console.log(rand_sensor)
        }
        if(this.z_home_sensor && this.x_home_sensor && this.y_home_sensor && this.homing && this.next_pos[2]===-100){
            this.now_pos[2]=0;
            this.next_pos[2]=0;
            this.z_home_state=true;
            this.homing=false;
            console.log("Z Home!");
            clearInterval(this.Homing_interval);
        }

    }

     Trdp_moove(){
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
            clearInterval(this.Mooving_interval)
        }
        console.log(this.now_pos);
    }
    Gcode_readLine(){
        this.line = this.liner.next()
        console.log('Line ' + this.lineNumber + ': ' + this.line.toString('ascii'));
        this.lineNumber++;
        return ""+this.line;
    }
    changeTemp() {
        this.bed_temp=bed_temp+10;
        this.date_var1=new Date()
        if(this.bed_temp>=1000){
            this.bed_temp=0;
        }
    }

    start_changing_temp(){
        setInterval(this.changeTemp, 1000);
    }
    start_homing(){
        if(!this.x_home_state || !this.y_home_state || !this.z_home_state){
            this.Homing_interval=setInterval(this.Trdp_homing,2000)
        }
    }
}






