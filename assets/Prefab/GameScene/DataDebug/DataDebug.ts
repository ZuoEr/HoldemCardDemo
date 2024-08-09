
const { ccclass, property } = cc._decorator;

@ccclass
export default class DataDebug extends cc.Component {
    onOpenButton() {

    }

    onPauseButton() {
        if (cc.game.isPaused()) {
            cc.game.resume();
        }
        else {
            cc.game.pause();
        }
    }
}
