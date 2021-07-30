import { CST } from "../CST";
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.MENU
        });
    }

    init(data) {
    console.log(data);
    console.log("IT WORKED")
    }



    create(){


    this.add.image(this.game.renderer.width/2, this.game.renderer.height * 0.2, "logo").setDepth(1);
    this.add.image(0,0, "title_bg").setOrigin(0);
    let playButton =  this.add.image(this.game.renderer.width/2, this.game.renderer.height / 2, "play_button").setDepth(1);
    let optionsButton = this.add.image(this.game.renderer.width/2, this.game.renderer.height / 2 + 100, "options_button").setDepth(1);



    playButton.setInteractive();
    optionsButton.setInteractive();

    playButton.on("pointerover", ()=>{
        console.log("Hovered")
    })
        playButton.on("pointerout", ()=>{
            console.log("Not Hovered")
        })

        playButton.on("pointerup", ()=>{
            this.scene.start(CST.SCENES.PLAY);
            console.log("Clicked")
        })


        optionsButton.on("pointerover", ()=>{
            console.log("Hovered")
        })

        optionsButton.on("pointerout", ()=>{
            console.log("Not Hovered")
        })

        optionsButton.on("pointerup", ()=>{
           //this.scene.launch
        })


    }


}