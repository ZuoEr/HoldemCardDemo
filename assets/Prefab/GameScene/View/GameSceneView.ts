import GameData from "../../../Scene/GameData";
import PokerCard from "../../PokerCard/PokerCard";

const { ccclass, property } = cc._decorator;

const CaseName = [
    "StraightFlush",
    "FourOfAKind",
    "FullHouse",
    "Flush",
    "Straight",
    "TwoPair",
    "OnePair",
    "HighCard",
]

@ccclass
export default class GameSceneView extends cc.Component {
    @property(cc.Animation)
    pokerCards: cc.Animation = null;
    @property(PokerCard)
    pokerCardArray: PokerCard[] = [];
    @property(cc.Button)
    startGameButton: cc.Button = null;

    @property(cc.Node)
    win1: cc.Node = null;
    @property(cc.Node)
    win2: cc.Node = null;
    @property(cc.Label)
    label1: cc.Label = null;
    @property(cc.Label)
    label2: cc.Label = null;

    onStartGameButton() {
        this.startGameButton.node.active = false;

        this.schedule(this.onStartGameRepeat.bind(this), 10, 99999999, 0.1);
    }

    onStartGameRepeat() {
        this.startGame();
    }

    // 开始游戏
    startGame() {
        // 洗牌
        GameData.ins.shuffleCards();
        this.win1.active = false;
        this.win2.active = false;
        this.label1.string = "";
        this.label2.string = "";

        // 发牌
        let encodeArray = this.dealCards();

        // 比较大小
        this.scheduleOnce(() => {
            let encodeArray1 = encodeArray.slice(0, 5);
            let encodeArray2 = encodeArray.slice(5, 10);
            console.log(encodeArray1, encodeArray2);
            this.comparison(encodeArray1, encodeArray2);
        }, 4);
    }
    // 发牌
    dealCards() {
        let encodeArray = GameData.ins.dealCards();
        for (let i = 0; i < this.pokerCardArray.length; i++) {
            this.pokerCardArray[i].init(encodeArray[i]);
        }
        this.pokerCards.play();
        return encodeArray;
    }
    // 比较大小
    comparison(encodeArray1: number[], encodeArray2: number[]) {
        let info = GameData.ins.pokerComparison(encodeArray1, encodeArray2);
        console.log(info);
        console.log("---------------------------------------------");
        if (info.winNum == 0) {
            this.win1.active = true;
            this.win2.active = true;
        }
        else if (info.winNum == 1) {
            this.win1.active = true;
            this.win2.active = false;
        }
        else if (info.winNum == 2) {
            this.win1.active = false;
            this.win2.active = true;
        }
        this.label1.string = CaseName[info.maxCase1];
        this.label2.string = CaseName[info.maxCase2];
    }
}
