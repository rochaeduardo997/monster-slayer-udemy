function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      monsterBaseStats: {
        hp: 100,
        attack: 11,
        defense: 5,
        giveExp: 200,
      },
      playerBaseStats: {
        hp: 100,
        attack: 9,
        defense: 7,
        countForSpecialAttack: 4,
        countForHeal: 3,
        level: {
          actualLevel: 1,
          expToNextLevel: 200,
        },
        totalExp: 0,
      },
      logs: [],
      gameStatus: false,
    }
  },
  computed: {
    monsterHP() {
      if (this.playerBaseStats.hp <= 0 && this.monsterBaseStats.hp <= 0) {
        this.monsterBaseStats.hp = 0;
        this.gameStatus = 'draw'

        return { width: 0 + '%' }
      } else if (this.monsterBaseStats.hp <= 0) {
        this.monsterBaseStats.hp = 0;
        this.playerBaseStats.totalExp += this.monsterBaseStats.giveExp;

        if (this.playerBaseStats.totalExp === this.playerBaseStats.level.expToNextLevel) {
          this.playerBaseStats.level.actualLevel++;
          this.playerBaseStats.level.expToNextLevel *= 2;

          this.playerBaseStats.attack += 5;
          this.playerBaseStats.defense += 2;

          this.monsterBaseStats.attack += 3;
          this.monsterBaseStats.defense += 2;
        }

        this.gameStatus = 'won'
        return { width: 0 + '%' }
      } else {
        return { width: this.monsterBaseStats.hp + '%' }
      }
    },
    playerHP() {
      if (this.playerBaseStats.hp <= 0 && this.monsterBaseStats.hp <= 0) {
        this.playerBaseStats.hp = 0;
        this.gameStatus = 'draw'

        return { width: 0 + '%' }
      } else if (this.playerBaseStats.hp <= 0) {
        this.playerBaseStats.hp = 0;

        this.gameStatus = 'lose'
        return { width: 0 + '%' }
      } else {
        return { width: this.playerBaseStats.hp + '%' }
      }
    }
  },
  methods: {
    logGenerate(action, who, value) {
      this.logs.unshift({
        actions: action,
        byWho: who,
        values: value,
      });
    },
    basicAttack() {
      let generatedNumber = generateRandomNumber(0, 3);
      let attackValue = generateRandomNumber(this.playerBaseStats.attack, this.monsterBaseStats.defense);

      if (generatedNumber === 2) {
        //both attack
        this.monsterBaseStats.hp -= attackValue;
        this.monsterBasicAttack();
        this.logGenerate('attack', 'player', attackValue);
      } else if (generatedNumber === 1) {
        //only player attack, monster miss
        this.monsterBaseStats.hp -= attackValue;
        this.logGenerate('attack', 'monster', 'miss');
      } else {
        //only monster attack, player miss
        this.monsterBasicAttack();
        this.logGenerate('attack', 'player', 'miss');
      }

      this.playerBaseStats.countForSpecialAttack++;
      this.playerBaseStats.countForHeal++;
    },
    monsterBasicAttack() {
      let attackValue = generateRandomNumber(this.monsterBaseStats.attack, this.playerBaseStats.defense);

      if (this.playerBaseStats.defense >= this.monsterBaseStats.attack) {
        attackValue = 1;
      }
      this.logGenerate('attack', 'monster', attackValue);
      console.log(this.logs)

      this.playerBaseStats.hp -= attackValue;
    },
    specialAttack() {
      let generatedNumber = generateRandomNumber(0, 2);
      let attackValue = 'miss';
      this.playerBaseStats.countForSpecialAttack = 0;

      if (this.playerBaseStats.countForSpecialAttack === 0) {
        if (generatedNumber === 1) {
          //only player attack
          attackValue = (this.playerBaseStats.attack * 2) - this.monsterBaseStats.defense;
          this.monsterBaseStats.hp -= attackValue;
        } else {
          //player miss
        }
      }
      this.logGenerate('special', 'player', attackValue);

      this.playerBaseStats.countForHeal++;
    },
    healPlayer() {
      let generatedNumber = generateRandomNumber(0, 3);
      let healValue = 'fail';
      this.playerBaseStats.countForHeal = 0;

      if (generatedNumber === 2) {
        //heal fail and be attack
        this.monsterBasicAttack();
        this.logGenerate('heal', 'player', healValue);
      } else if (generatedNumber === 1) {
        //only heal
        healValue = 5;
        this.playerBaseStats.hp += healValue;

        this.logGenerate('heal', 'player', healValue);
      } else {
        //double heal
        healValue = 5 * 2;
        this.playerBaseStats.hp += healValue;
        this.logGenerate('heal', 'player', healValue);
      }

      if (this.playerBaseStats.hp >= 100) {
        this.playerBaseStats.hp = 100;
      }
      this.playerBaseStats.countForSpecialAttack++;
      this.playerBaseStats.countForHeal++;
    },
    tryAgain() {
      if (this.gameStatus == 'won' || this.gameStatus == 'draw') {
        this.monsterBaseStats.hp = 100;
        this.monsterBaseStats.giveExp = 200;

        this.playerBaseStats.hp = 100;
        this.playerBaseStats.countForSpecialAttack = 4;
        this.playerBaseStats.countForHeal = 3;
        this.gameStatus = false;
      } else {
        this.monsterBaseStats.hp = 100;
        this.monsterBaseStats.giveExp = 200;

        this.playerBaseStats.hp = 100;
        this.playerBaseStats.countForSpecialAttack = 4;
        this.playerBaseStats.countForHeal = 3;
        this.gameStatus = false;
      }

      this.logs = [];
    },
    surrender() {
      this.gameStatus = 'lose';
    }
  }
});

app.mount('#game');