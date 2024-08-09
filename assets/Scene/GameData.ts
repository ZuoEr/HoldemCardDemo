const { ccclass, property } = cc._decorator;
@ccclass
export default class GameData {
    private static _ins: GameData = null;
    public static get ins() {
        if (this._ins == null) {
            this._ins = new GameData;
        }
        return this._ins;
    }

    _cardArray: number[] = [];

    constructor() {
        this.initCards();
    }

    initCards() {
        this._cardArray = [];
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 13; i++) {
                this._cardArray.push(((j + 1) * 100) + (i + 2));
            }
        }
    }

    shuffleCards() {
        for (let i = 0; i < 3; i++) {
            for (let i = this._cardArray.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let t = this._cardArray[i];
                this._cardArray[i] = this._cardArray[j];
                this._cardArray[j] = t;
            }
        }
    }

    dealCards() {
        let cardArray = this._cardArray.slice(0, 10);
        this._cardArray = this._cardArray.splice(0, 10);
        return cardArray;
    }

    // 牌力大小比较
    pokerComparison(encodeArray1: number[], encodeArray2: number[]): { winNum: number, maxCase1: number, maxCase2: number } {
        class Hand {
            suits: number[] = [];        // 记录手牌中出现过得所有牌的花色
            faces: number[] = [];        // 记录手牌中出现过得所有牌的出现的次数
            constructor() {
                for (let i = 0; i < 4; i++) {
                    this.suits[i] = 0;
                }
                for (let i = 0; i < 52; i++) {
                    this.faces[i] = 0;
                }
            }
        }
        class MaxHand {
            maxCase: number = 99;       // 记录最大牌型（StraightFlush, FourOfAKind, FullHouse...）
            MaxHand: number = 0;        // 记录最大五张牌和得分（bit位记录牌，int值表示得分）
            FlushFlag: boolean = false; // 记录是否存在同花牌型
            FlushSuit: number = -1;     // 如果有同花，记录同花的花色编号
        }
        let hand1: Hand = analyzeHand(encodeArray1);
        let hand2: Hand = analyzeHand(encodeArray2);
        let maxHand1: MaxHand = getMaxHands(hand1);
        let maxHand2: MaxHand = getMaxHands(hand2);
        console.log(maxHand1, maxHand2);
        if (maxHand1.maxCase == maxHand2.maxCase) {
            if (maxHand1.MaxHand == maxHand2.MaxHand) {
                return { winNum: 0, maxCase1: maxHand1.maxCase, maxCase2: maxHand2.maxCase };
            }
            else if (maxHand1.MaxHand > maxHand2.MaxHand) {
                return { winNum: 1, maxCase1: maxHand1.maxCase, maxCase2: maxHand2.maxCase };
            }
            else {
                return { winNum: 2, maxCase1: maxHand1.maxCase, maxCase2: maxHand2.maxCase };
            }
        }
        else if (maxHand1.maxCase < maxHand2.maxCase) {
            return { winNum: 1, maxCase1: maxHand1.maxCase, maxCase2: maxHand2.maxCase };
        }
        else {
            return { winNum: 2, maxCase1: maxHand1.maxCase, maxCase2: maxHand2.maxCase };
        }

        function analyzeHand(encodeArray: number[]) {
            let hand = new Hand;
            for (const encode of encodeArray) {
                const suit = Math.floor(encode / 100) - 1;
                const point = Math.floor(encode % 100) - 1;
                hand.suits[suit] += 1;
                hand.faces[point] += 1;
            }
            return hand;
        }
        function getMaxHands(hand: Hand) {
            let maxHand = new MaxHand;
            if (isStraightFlush(hand, maxHand)) {
            }
            else if (isFourOfAKind(hand, maxHand)) {
            }
            else if (isFullHouse(hand, maxHand)) {
            }
            else if (isFlush(hand, maxHand)) {
            }
            else if (isStraight(hand, maxHand)) {
            }
            else if (isTwoPair(hand, maxHand)) {
            }
            else if (isOnePair(hand, maxHand)) {
            }
            else if (isHighCard(hand, maxHand)) {
            }
            return maxHand;
        }

        // 筛选同花顺
        function isStraightFlush(hand: Hand, maxHand: MaxHand) {
            var tempValue: number = 0;
            for (let i = 0; i < hand.suits.length; i++) {
                const cardNum = hand.suits[i];
                // 检测同花
                if (cardNum >= 5) {
                    maxHand.FlushFlag = true;
                    maxHand.FlushSuit = i;
                    // 再用检查是否有顺子，若有则标记为同花顺
                    tempValue = findStraight(hand);
                    if (tempValue != 0) {
                        if (tempValue > maxHand.MaxHand) {
                            maxHand.MaxHand = tempValue;
                        }
                        maxHand.maxCase = 0;
                    }
                }
            }
            return maxHand.maxCase == 0;
        }
        // 筛选四条
        function isFourOfAKind(hand: Hand, maxHand: MaxHand) {
            for (let i = 0; i < hand.faces.length; i++) {
                const cardNum = hand.faces[i];
                if (cardNum >= 4) {
                    maxHand.maxCase = 1;
                    maxHand.MaxHand = i * 4;
                    return true;
                }
            }
            return false;
        }
        // 筛选葫芦
        function isFullHouse(hand: Hand, maxHand: MaxHand) {
            let firstOne = -1;
            let scondOne = -1;
            for (let i = 0; i < hand.faces.length; i++) {
                const cardNum = hand.faces[i];
                if (cardNum >= 3) {
                    firstOne = i;
                }
                else if (cardNum >= 2) {
                    if (scondOne != -1) {
                        break;
                    }
                    scondOne = i;
                }
            }
            if (firstOne != -1 && scondOne != -1) {
                maxHand.maxCase = 2;
                maxHand.MaxHand = (firstOne + 2) * 3 + (scondOne + 2) * 2;
                return true;
            }
            return false;
        }
        // 筛选同花
        function isFlush(hand: Hand, maxHand: MaxHand) {
            if (maxHand.FlushFlag) {
                let score = 0;
                for (let i = 0; i < hand.faces.length; i++) {
                    const cardNum = hand.faces[i];
                    if (cardNum >= 1) {
                        score += i;
                    }
                }
                maxHand.maxCase = 3;
                maxHand.MaxHand = score;
                return true;
            }
            return false;
        }
        // 筛选顺子
        function isStraight(hand: Hand, maxHand: MaxHand) {
            if (findStraight(hand)) {
                let score = 0;
                for (let i = 0; i < hand.faces.length; i++) {
                    const cardNum = hand.faces[i];
                    if (cardNum >= 1) {
                        score += i;
                    }
                }
                maxHand.maxCase = 4;
                maxHand.MaxHand = score;
                return true;
            }
            return false;
        }
        // 筛选两对
        function isTwoPair(hand: Hand, maxHand: MaxHand) {
            let firstOne = -1;
            let scondOne = -1;
            let thirdOne = -1;
            for (let i = 0; i < hand.faces.length; i++) {
                const cardNum = hand.faces[i];
                if (firstOne == -1 && cardNum >= 2) {
                    firstOne = i;
                }
                else if (scondOne == -1 && cardNum >= 2) {
                    scondOne = i;
                }
                else if (thirdOne == -1 && cardNum >= 1) {
                    thirdOne = i;
                }
            }
            if (firstOne != -1 && scondOne != -1) {
                maxHand.maxCase = 5;
                maxHand.MaxHand = (firstOne + 2) * 2 + (scondOne + 2) * 2 + (thirdOne + 2);
                return true;
            }
        }
        // 筛选一对
        function isOnePair(hand: Hand, maxHand: MaxHand) {
            let firstOne = -1;
            let otherScore = 0;
            for (let i = 0; i < hand.faces.length; i++) {
                const cardNum = hand.faces[i];
                if (firstOne == -1 && cardNum >= 2) {
                    firstOne = i;
                }
                else if (cardNum >= 1) {
                    otherScore += i;
                }
            }
            if (firstOne != -1) {
                maxHand.maxCase = 6;
                maxHand.MaxHand = (firstOne + 2) * 2 + otherScore;
                return true;
            }
        }
        // 筛选高牌
        function isHighCard(hand: Hand, maxHand: MaxHand) {
            let score = 0;
            for (let i = 0; i < hand.faces.length; i++) {
                const cardNum = hand.faces[i];
                if (cardNum >= 1) {
                    score += i;
                }
            }
            maxHand.maxCase = 7;
            maxHand.MaxHand = score;
            return true;
        }


        // 查找顺子
        function findStraight(hand: Hand) {
            let tempValue = 0;
            let isStraight = false;
            for (let i = 0; i < 52 - 5; i++) {
                isStraight = true;
                for (let j = 0; j < 5; j++) {
                    const cardNum = hand.faces[i + j];
                    if (cardNum != 1) {
                        isStraight = false;
                        break;
                    }
                }
                if (isStraight) {
                    tempValue = i + (i + 1) + (i + 2) + (i + 3) + (i + 4);
                    break;
                }
            }
            // A2345
            if (isStraight == false &&
                hand.faces[51] == 1 &&
                hand.faces[0] == 1 &&
                hand.faces[1] == 1 &&
                hand.faces[2] == 1 &&
                hand.faces[3] == 1
            ) {
                tempValue = 1 + 2 + 3 + 4 + 5;
                isStraight = true;
            }
            return tempValue;
        }
    }
}
