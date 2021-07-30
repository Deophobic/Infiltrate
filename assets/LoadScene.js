export class LoadScene extends Phaser.Scene{
constructor() {
    super({
        key:CST.SCENES.LOAD
    });
}
init(){

}
    preload(){

    this.load.image("title_bg", "./images/title_bg.jpg");

    this.load.image("options_button", "./images/options_button.jpg");


    this.load.image("play_button", "./images/play_button.jpg");


    this.load.image("logo", "./images/logo.jpg");

    let loadingBar = this.add.graphics({
        fillStyle:{
            color: 0xffffff
        }
    })

        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            console.log(percent);
        })

        this.load.on("finished",()=>{
           console.log("Finished Loading")

        })

    }

    create(){

    this.scene.start(CST.SCENES.MENU,"Scene Loaded")
    }

}