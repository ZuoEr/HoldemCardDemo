
const { ccclass, property } = cc._decorator;
@ccclass
export default class PokerCard extends cc.Component {

    @property([cc.SpriteFrame])
    typeSf: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    numSf: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    type: cc.Sprite = null;
    @property(cc.Sprite)
    num: cc.Sprite = null;

    init(encode: number) {
        let suit = Math.floor(encode / 100) - 1;
        let num = Math.floor(encode % 100) - 2;
        this.type.spriteFrame = this.typeSf[suit] ? this.typeSf[suit] : null;
        this.num.spriteFrame = this.numSf[num] ? this.numSf[num] : null;
    }

}
