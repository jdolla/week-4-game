
var heroes = [];

//https://learn.jquery.com/code-organization/concepts/
//https://stackoverflow.com/questions/15505405/javascript-creating-new-instance-of-objects
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



$(document).ready(function () {

    $("#staging-section").on("click", ".card", function () {
        heroes = $(this).parent().children().clone();
        $(heroes).addClass("clone");

    })

    $("#hero-section").on("click", ".card", function () {
        console.log($(this).parent().attr("id"));
        console.log(this);
    })

    $("#enemy-section").on("click", ".card", function () {
        console.log($(this).parent().attr("id"));
        console.log(this);
    })

    $("#defender-section").on("click", ".card", function () {
        console.log($(this).parent().attr("id"));
        console.log(this);
    })

    function findCloneByName(name) {
        for (var i = 0; i < heroes.length; i++) {
            if ($(heroes[i]).attr("data-name") === name) {
                return heroes[i];
            }
        }
    }
})