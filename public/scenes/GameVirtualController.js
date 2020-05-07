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

        // virtual game controller buttons
        
        // x button
        let buttonX = this.add.sprite(480, 288, 'buttonX', 1).setOrigin(0, 0).setScale(1).setScrollFactor(0).setInteractive();
        buttonX.on("pointerdown", () => {
            console.log("buttonX down")
            buttonX.setFrame(0).setScale(0.9)
            virtualControllerStates.x = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonX.on("pointerup", () => {
            console.log("buttonX up")
            buttonX.setFrame(1).setScale(1)
            virtualControllerStates.x = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        // y button
        let buttonY = this.add.sprite(560, 256, 'buttonY', 1).setOrigin(0, 0).setScale(1).setScrollFactor(0).setInteractive();
        buttonY.on("pointerdown", () => {
            console.log("buttonY down")
            buttonY.setFrame(0).setScale(0.9)
            virtualControllerStates.y = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonY.on("pointerup", () => {
            console.log("buttonY up")
            buttonY.setFrame(1).setScale(1)
            virtualControllerStates.y = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });     
        // left button
        let buttonLeft = this.add.sprite(16, 256, 'buttonHorizontal', 1).setOrigin(0, 0).setScale(1).setScrollFactor(0).setInteractive();
        buttonLeft.on("pointerdown", () => {
            console.log("buttonLeft down")
            buttonLeft.setFrame(0).setScale(0.9)
            virtualControllerStates.left = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonLeft.on("pointerup", () => {
            console.log("buttonLeft down")
            buttonLeft.setFrame(1).setScale(1)
            virtualControllerStates.left = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        // right button
        let buttonRight = this.add.sprite(112, 256, 'buttonHorizontal', 1).setOrigin(0, 0).setScale(1).setScrollFactor(0).setInteractive();
        buttonRight.on("pointerdown", () => {
            console.log("buttonRight down")
            buttonRight.setFrame(0).setScale(0.9)
            virtualControllerStates.right = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonRight.on("pointerup", () => {
            console.log("buttonRight up")
            buttonRight.setFrame(1).setScale(1)
            virtualControllerStates.right = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        // up button
        let buttonUp = this.add.sprite(80, 192, 'buttonVertical', 1).setOrigin(0, 0).setScale(1).setScrollFactor(0).setInteractive();
        buttonUp.on("pointerdown", () => {
            console.log("buttonUp down")
            buttonUp.setFrame(0).setScale(0.9)
            virtualControllerStates.up = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonUp.on("pointerup", () => {
            console.log("buttonUp down")
            buttonUp.setFrame(1).setScale(1)
            virtualControllerStates.up = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        // down button
        let buttonDown = this.add.sprite(80, 288, 'buttonVertical', 1).setOrigin(0, 0).setScale(1).setScrollFactor(0).setInteractive();
        buttonDown.on("pointerdown", () => {
            console.log("buttonDown down")
            buttonDown.setFrame(0).setScale(0.9)
            virtualControllerStates.down = true;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });
        buttonDown.on("pointerup", () => {
            console.log("buttonDown up")
            buttonDown.setFrame(1).setScale(1)
            virtualControllerStates.down = false;
            this.events.emit('buttonUpdate', virtualControllerStates)
        });

        console.log("GameVirtualController complete")
    }

    update(){
        
    }
}