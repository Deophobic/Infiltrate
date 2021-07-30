var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1000,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var Game = new Phaser.Game(config);


Game.MainMenu = function(game) {


};

var titlescreen;

Game.MainMenu.prototype = {
    create:function(game) {

        this.createButton(game,"Play",game.world.centerX,game.world.centerY + 32,300,100, function(){
            this.state.start('Game');
        });

        this.createButton(game,"Controls",game.world.centerX,game.world.centerY + 192,300,100, function(){
            this.state.start('Controls');
        });

        titlescreen = game.add.sprite(game.world.centerX,game.world.centerY - 192, 'titlescreen');
        titlescreen.anchor.setTo(0.5,0.5);

    },

    update:function(game) {

    },

    createButton:function(string,x,y,w,h,callback) {
        var button1 = game.add.button(x,y,'button', callback,this,2,1,0);

        button1.anchor.setTo(0.5,0.5);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x,button1.y, string, {font:"14px Arial", fill:"#fff", align:"center"});

        txt.anchor.setTo(0.5,0.5);
    }

};