const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {
    @property(cc.Node)
    gameRoot: cc.Node = null;
    @property(cc.Prefab)
    gameScenePrefab: cc.Prefab = null;

    onLoad() {
        cc.game.setFrameRate(29.9);

        this.gameRoot.addChild(cc.instantiate(this.gameScenePrefab));
    }
}
