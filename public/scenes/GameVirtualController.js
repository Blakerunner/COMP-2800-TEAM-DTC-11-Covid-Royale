import {GameScene} from "../scenes/GameScene.js"
export class GameVirtualController extends Phaser.Scene {
    constructor(){
        super({
            key: "GameVirtualController",
            active: false
        })
    }

    init(){
        console.log("GameVirtualController start")
    }
    
    preload(){
        //gamepad buttons
        this.load.spritesheet('buttonVertical', './assets/img/button-vertical.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('buttonHorizontal', './assets/img/button-horizontal.png', { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet('buttonX', './assets/img/button-round-a.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('buttonY', './assets/img/button-round-b.png', { frameWidth: 64, frameHeight: 64 });
    }
    
    create(){
        let virtualControllerStates = {
            x: false, 
            y: false, 
            left: false, 
            right: false, 
            up: false, 
            down: false
        }

        let buttonXPosX = 512
        let buttonXPosY = 320
        let buttonYPosX = 592
        let buttonYPosY = 288
        let buttonLeftPosX = 43
        let buttonLeftPosY = 272
        let buttonRightPosX = 149
        let buttonRightPosY = 272
        let buttonUpPosX = 96
        let buttonUpPosY = 219
        let buttonDownPosX = 96
        let buttonDownPosY = 325

        // virtual game controller buttons
        
        // x button
        let buttonX = this.add.sprite(buttonXPosX, buttonXPosY, 'buttonX', 1).setScale(1).setScrollFactor(0).setInteractive();
        buttonX.on("pointerdown", () => {
            buttonX.setFrame(0).setScale(0.9)
            virtualControllerStates.x = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonX.on("pointerup", () => {
            buttonX.setFrame(1).setScale(1)
            virtualControllerStates.x = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonX.on("pointerout", () => {
            buttonX.setFrame(1).setScale(1)
            virtualControllerStates.x = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        // y button
        let buttonY = this.add.sprite(buttonYPosX, buttonYPosY, 'buttonY', 1).setScale(1).setScrollFactor(0).setInteractive();
        buttonY.on("pointerdown", () => {
            buttonY.setFrame(0).setScale(0.9)
            virtualControllerStates.y = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonY.on("pointerup", () => {
            buttonY.setFrame(1).setScale(1)
            virtualControllerStates.y = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonY.on("pointerout", () => {
            buttonY.setFrame(1).setScale(1)
            virtualControllerStates.y = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });  
        // left button
        let buttonLeft = this.add.sprite(buttonLeftPosX, buttonLeftPosY, 'buttonHorizontal', 1).setScale(1, 1.3).setScrollFactor(0).setInteractive();
        buttonLeft.on("pointerdown", () => {
            buttonLeft.setFrame(0).setScale(0.9, 1.2)
            virtualControllerStates.left = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonLeft.on("pointerup", () => {
            buttonLeft.setFrame(1).setScale(1, 1.3)
            virtualControllerStates.left = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonLeft.on("pointerout", () => {
            buttonLeft.setFrame(1).setScale(1, 1.3)
            virtualControllerStates.left = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        // right button
        let buttonRight = this.add.sprite(buttonRightPosX, buttonRightPosY, 'buttonHorizontal', 1).setScale(1, 1.3).setScrollFactor(0).setInteractive();
        buttonRight.on("pointerdown", () => {
            buttonRight.setFrame(0).setScale(0.9, 1.2)
            virtualControllerStates.right = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonRight.on("pointerup", () => {
            buttonRight.setFrame(1).setScale(1, 1.3)
            virtualControllerStates.right = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonRight.on("pointerout", () => {
            buttonRight.setFrame(1).setScale(1, 1.3)
            virtualControllerStates.right = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        // up button
        let buttonUp = this.add.sprite(buttonUpPosX, buttonUpPosY, 'buttonVertical', 1).setScale(1.3, 1).setScrollFactor(0).setInteractive();
        buttonUp.on("pointerdown", () => {
            buttonUp.setFrame(0).setScale(1.2, 0.9)
            virtualControllerStates.up = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonUp.on("pointerup", () => {
            buttonUp.setFrame(1).setScale(1.3, 1)
            virtualControllerStates.up = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonUp.on("pointerout", () => {
            buttonUp.setFrame(1).setScale(1.3, 1)
            virtualControllerStates.up = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        // down button
        let buttonDown = this.add.sprite(buttonDownPosX, buttonDownPosY, 'buttonVertical', 1).setScale(1.3, 1).setScrollFactor(0).setInteractive();
        buttonDown.on("pointerdown", () => {
            buttonDown.setFrame(0).setScale(1.2, 0.9)
            virtualControllerStates.down = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonDown.on("pointerup", () => {
            buttonDown.setFrame(1).setScale(1.3, 1)
            virtualControllerStates.down = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonDown.on("pointerout", () => {
            buttonDown.setFrame(1).setScale(1.3, 1)
            virtualControllerStates.down = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        
        console.log("GameVirtualController complete")
    }

    update(){
        
    }
}