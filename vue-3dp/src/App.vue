<template>
  <div id="app">
    <div class="header"><h1>3d printer emulator</h1></div>
    <div id="sidebar" class="sidebar">
      <button @click="start_work()" v-if="!Trdp_data.working">Start work</button>
      <button @click="stop_work()" v-else>Stop work</button>
      <br/>
      <button @click="set_line()">set line</button> <input v-model="setLineNum" @onKeyUp="isNumber($event)">
      <pre>{{ Trdp_data }}</pre>
    </div>
    <div id="content">
      <GCodePreview ref="gcodePreview1" class="gcode-preview" :topLayerColor="'lime'" :lastSegmentColor="'red'" renderTravel="True" travelColor="green" extrusionColor="pink" /> <!--renderTubes="True"-->
    </div>
    <!-- <div># layers loaded: {{ layersLoaded }}</div> -->


  </div>
</template>

<script>
import axios from "axios";

const loadJSONDelay = 1000;
const loadGcodeDelay=50;
const gCodeUrl = 'http://localhost:3000/gcode/CFFFP_Schneekugel.gcode';



import GCodePreview from './components/GCodePreview.vue';
let layersLoaded = 0;
const chunkSize = 150; //by overing that amount of lines its rendering
let endFileLine=25000;
export default {
  components: {
    GCodePreview
  },

  data() {
    return {
      layersLoaded: layersLoaded,
      url_json: 'http://localhost:3000/datagen/opc-server-3dpr/getdatajson',
      url_start: 'http://localhost:3000/datagen/opc-server-3dpr/start',
      url_stop: 'http://localhost:3000/datagen/opc-server-3dpr/stop',
      url_setline: 'http://localhost:3000/datagen/opc-server-3dpr/setline/',
      Trdp_data: [],
      firstRender:true,
      rendering:false,
      setLineNum:200
    };
  },
  async mounted() {

    const lines1 = await this.fetchGcode(gCodeUrl);
    //this.load_json_data_from_server();
    //this.loadPreviewChunked(this.$refs.gcodePreview1, lines1,50);
    this.load_json_data_from_server_anim();
    console.log(lines1.length)
  },

  methods: {
    async fetchGcode(url) {
      const response = await fetch(url);

      if (response.status !== 200) {
        throw new Error(`status code: ${response.status}`);
      }

      const file = await response.text();
      return file.split('\n');
    },

    loadPreviewChunked(target, lines, delay) {
      let c = 0;
      const id = '__animationTimer__' + Math.random().toString(36).substr(2, 9);
      const loadProgressive = (preview) => {
        const start = c * chunkSize;
        const end = (c + 1) * chunkSize;
        const chunk = lines.slice(start, end);
        target.processGCode(chunk);
        // this.layersLoaded = target.layerCount;
        c++;
        if (c * chunkSize < lines.length) {
          window[id] = setTimeout(loadProgressive, delay);
        }
      };
      // cancel loading process if one is still in progress
      // mostly when hot reloading
      window.clearTimeout(window[id]);
      loadProgressive(target);
    },
    loadPreviewChunked1(target, lines,startFileLine1,endFileLine1, delay) {
      let c = 0;
      const id = '__animationTimer__' + Math.random().toString(36).substr(2, 9);
      const loadProgressive = (preview) => {
        const start = c * chunkSize;
        const end = (c + 1) * chunkSize;
        const tt = lines.slice(startFileLine1, endFileLine1);
        const chunk = tt.slice(start, end);
        target.processGCode(chunk);
        // this.layersLoaded = target.layerCount;
        c++;
        if (c * chunkSize < lines.length) {
          window[id] = setTimeout(loadProgressive, delay);
        }
      };


      // cancel loading process if one is still in progress
      // mostly when hot reloading
      window.clearTimeout(window[id]);
      loadProgressive(target);
    },
    load_json_data_from_server() {
      let c = 0;
      const id = '__jsonTimer__' + Math.random().toString(36).substr(2, 9);
      const loadJSON = () => {

        //console.log(this.Trdp_data.working_line_num,typeof this.Trdp_data.working_line_num,lines.slice(this.Trdp_data.working_line_num,this.Trdp_data.working_line_num))

        //target.processGCode(chunk);

        axios.get(this.url_json).then(async (response) => {
          this.Trdp_data = response.data
         /* if (this.endFileLine !== chunkSize * Math.trunc(this.Trdp_data.working_line_num / chunkSize)) {
            const lines1 = await this.fetchGcode(gCodeUrl);
            this.endFileLine = chunkSize * Math.trunc(this.Trdp_data.working_line_num / chunkSize);
            this.loadPreviewChunked(this.$refs.gcodePreview1, lines1, endFileLine, 50);
          }

          console.log(this.Trdp_data.working_line_num, this.endFileLine, Math.trunc(this.Trdp_data.working_line_num / chunkSize))
        */
        })
        window[id] = setTimeout(loadJSON, loadJSONDelay);
      };

      // cancel loading process if one is still in progress
      // mostly when hot reloading
      window.clearTimeout(window[id]);
      loadJSON();
    },
    load_json_data_from_server_anim() {
      let c = 0;
      const id = '__jsonTimer__' + Math.random().toString(36).substr(2, 9);
      const loadJSON = () => {

        //console.log(this.Trdp_data.working_line_num,typeof this.Trdp_data.working_line_num,lines.slice(this.Trdp_data.working_line_num,this.Trdp_data.working_line_num))

        //target.processGCode(chunk);

        axios.get(this.url_json).then(async (response) => {
          this.Trdp_data = response.data
           if (endFileLine !== chunkSize * Math.trunc(this.Trdp_data.working_line_num / chunkSize) || this.firstRender) {
             const lines1 = await this.fetchGcode(gCodeUrl);
             endFileLine = chunkSize * Math.trunc(this.Trdp_data.working_line_num / chunkSize);
             let startFileLine=0;
             if(this.firstRender){
               startFileLine =0;
               this.firstRender=false;
             }
             else {
                startFileLine = endFileLine - chunkSize;
             }
             this.loadPreviewChunked1(this.$refs.gcodePreview1, lines1,startFileLine, endFileLine, loadGcodeDelay);
             console.log("re ANIM")
             // make rendering==true checking to preventing errors
           }

           console.log(this.Trdp_data.working_line_num, endFileLine, Math.trunc(this.Trdp_data.working_line_num / chunkSize))

        })
        window[id] = setTimeout(loadJSON, loadJSONDelay);
      };

      // cancel loading process if one is still in progress
      // mostly when hot reloading
      window.clearTimeout(window[id]);
      loadJSON();
    },
    start_work(){
      axios.get(this.url_start).then(async (response) => {
         console.log("Start work");
      })
    },
    stop_work(){
      axios.get(this.url_stop).then(async (response) => {
        console.log("Start work");
      })
    },
    set_line(){

      axios.get(this.url_setline+this.setLineNum).then(async (response) => {
        console.log("Set line",this.url_setline+this.setLineNum);
      })
    },
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
  },

};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


@media only screen and (min-width: 769px) {
  .sidebar{
    width:25%;
    float:left;
  }
  .gcode-preview {
    //width: 75vw;
    margin: auto;
    width:75%;
    float:right;
  }
  .header{
    width: 100%;
  }
  #app {
    height: 100%;
    margin: 0;
  }
}
</style>
