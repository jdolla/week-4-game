
//https://learn.jquery.com/code-organization/concepts/
//https://stackoverflow.com/questions/15505405/javascript-creating-new-instance-of-objects

var stagingSection = $("#staging-section");
var heroSection = $("#hero-section");
var enemySection = $("#enemy-section");
var defenderSection = $("#defender-section");

var Champion = (function (hero) {

    var private = {
        hero: hero,
        name: "",
        hp: null,
        attackPower: 0,
        baseAttack: 0,
        counterAttack: 0
    }

    private.name = $(hero).children(".hero-name").first().html();
    private.hp = $(hero).children(".hp").first();
    private.attackPower = parseInt($(hero).attr("data-attack"));
    private.baseAttack = private.attackPower;
    private.counterAttack = parseInt($(hero).attr("data-counter"));

    function setHp(hp) {
        private.hp.html(hp);
    }

    function getHp() {
        return parseInt(private.hp.html());
    }

    return {
        card: function(){
            return private.hero;
        },

        name: function () {
            return private.name;
        },

        hp: function () {
            return private.hp;
        },

        takeDamage: function (damageAmount) {
            setHp(getHp() - damageAmount);
            if (getHp() <= 0) {
                return 0;
            }
            else {
                return private.counterAttack;
            }
        },

        attack: function (opponent) {
            //https://css-tricks.com/template-literals/  --<<-- way cool!
            var currentPower = private.attackPower;
            var counterDamage = opponent.takeDamage(currentPower);

            if (counterDamage <= 0) {
                return {
                    round: "won",
                    battleReport: `You defeated ${opponent.name()}!`
                }
            }
            else {
                private.attackPower += private.baseAttack;
                setHp(getHp() - counterDamage);
                if (getHp() <= 0) {
                    return {
                        round: "lost",
                        battleReport: `You were defeated by ${opponent.name()}!`
                    }
                }
                else {
                    return {
                        round: "draw",
                        battleReport: `You attacked ${opponent.name()} for ${currentPower} damage.` +
                            `<br>${opponent.name()} attacked you for ${counterDamage} damage.`
                    }

                }
            }
        },
        
        destroy: function(){
            $(private.hero).remove();
        }
    }
});

var game = {
    playerCharacter: null,
    enemies: [],
    defender: null,
    matchInProgress: false,


    setup: function (pc, heroes) {
        this.playerCharacter = null;
        this.enemies = [];
        this.defender = null;

        var pcName = $(pc).attr("data-name");
        for (var i = 0; i < heroes.length; i++) {
            var heroName = $(heroes[i]).attr("data-name");
            if (heroName === pcName) {
                this.playerCharacter = new Champion(heroes[i]);
            }
            else {
                this.enemies.push(heroes[i]);
            }
        }

        $(heroSection).append(this.playerCharacter.card());
        $.each(this.enemies, function(i, enemy){
            $(enemySection).append(enemy);
        });
        $(stagingSection).hide();

    },

    reset: function(){
        $(heroSection).empty();
        $(enemySection).empty();
        $(stagingSection).show();
    },

    setDefender: function(card){
        if(!this.matchInProgress){
            
            if(this.defender != null){
                this.removeDefender(this.defender.card);
            }
            
            this.defender = new Champion(card);
            $(defenderSection).append(card);  
        }
    },

    removeDefender: function(card){
        if(this.defender != null && !this.matchInProgress){
            $(enemySection).append(this.defender.card());
        }
    },

    destroyDefender: function(card){
        var enemyName = $(card).attr("data-name");
        for(var i = 0; i < this.enemies.length; i++){
            if(enemyName === $(this.enemies[i]).attr("data-name")){
                card.remove();
                this.enemies.splice(i, 1);
                this.defender = null;
            }
        }
    }
}

$(document).ready(function() {

    $(stagingSection).on("click", ".card", function () {
        heroes = $(stagingSection).children().clone();
        game.setup(this, heroes);
    })

    $("#enemy-section").on("click", ".card", function () {
        game.setDefender(this);
    })

    $("#defender-section").on("click", ".card", function () {
        game.removeDefender(this);
    })

})