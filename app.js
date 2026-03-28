const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("upload");
const generateBtn = document.getElementById("generate");
const downloadLink = document.getElementById("download");

let img = new Image();

upload.onchange = e=>{
 img.src = URL.createObjectURL(e.target.files[0]);
};

generateBtn.onclick = async ()=>{

 const stream = canvas.captureStream(60);
 const recorder = new MediaRecorder(stream);

 let chunks=[];
 recorder.ondataavailable=e=>chunks.push(e.data);

 recorder.onstop=()=>{
   const blob=new Blob(chunks,{type:"video/webm"});
   const url=URL.createObjectURL(blob);

   downloadLink.href=url;
   downloadLink.download="ai_video.webm";
   downloadLink.style.display="inline";
   downloadLink.innerText="DOWNLOAD VIDEO";
 };

 recorder.start();

 let duration=12;
 let fps=120;
 let totalFrames=duration*fps;

 for(let i=0;i<totalFrames;i++){

   let t=i/totalFrames;

   let zoom=1.1+t*0.25;
   let shakeX=Math.sin(i*0.4)*2;
   let shakeY=Math.cos(i*0.35)*2;

   ctx.clearRect(0,0,canvas.width,canvas.height);

   let w=canvas.width*zoom;
   let h=canvas.height*zoom;

   ctx.drawImage(
     img,
     -(w-canvas.width)/2+shakeX,
     -(h-canvas.height)/2+shakeY,
     w,
     h
   );

   await new Promise(r=>setTimeout(r,1000/60));
 }

 recorder.stop();
};
