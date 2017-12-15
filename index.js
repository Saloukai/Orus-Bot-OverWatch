/*******************
 * Bot Fox Discord *
 *******************/

// Include
const Discord = require("discord.js");
const fs = require("fs-extra");
const Bot = new Discord.Client();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let cookie = JSON.parse(fs.readFileSync("./cookie.json", "utf8"));

function getMain(member) {
    var x = new XMLHttpRequest();

    x.open("GET", "http://ow-api.herokuapp.com/stats/pc/eu/"+member, false);
    x.send();
    x = JSON.parse(x.responseText);
    x = x.stats.top_heroes.competitive;
    return (x[0]['hero']);
    return (0);
}

function getTime(temps) {
    var heure = Math.floor(temps);
    var minutes = Math.floor((temps - heure) * 60);
    var secondes = Math.round((((temps - heure) * 60) - minutes) * 60);
    var result = "";

    if (heure > 0)
        result += heure + "H ";
    if (minutes > 0)
        result += minutes + " minutes ";
    if (secondes > 0)
        result += secondes + " secondes ";

    return (result);
}

function getRankedSign(cote) {
    if (cote < 1500)
        return ("<:bronze:365546098963513344>");
    else if (cote >= 1500 && cote < 2000)
        return ("<:silver:365546369345126402>");
    else if (cote >= 2000 && cote < 2500)
        return ("<:gold:365093240300371980>");
    else if (cote >= 2500 && cote < 3000)
        return ("<:platine:365546146778578954>");
    else if (cote >= 3000 && cote < 3500)
        return ("<:diamant:365546195017400330>");
    else if (cote >= 3500 && cote < 4000)
        return ("<:master:365546421883240448>");
    else if (cote >= 4000 && cote < 4500)
        return ("<:gm:365546482763300865>");
    else
        return NULL;
}

Bot.on("ready", function(){
    Bot.user.setAvatar("fox.png");
    console.log("Ready");
});


/*connection.connect();

 connection.query('SELECT * FROM foxUsers', function (error, results, fields) {
 console.log(results);
 console.log(error);
 });

 connection.end();*/

Bot.on("message", function(message){

    /***************
     * FOX ACADEMY *
     ***************/

    if (message.content.startsWith("!fox")) {
        var id = message.member.id;
        var battletag = message.toString().substring(5);
        var pseudo = message.toString().substring(5, message.toString().indexOf('#'));
        var hashtag = message.toString().substring(message.toString().indexOf('#') + 1);

        if (!id) return;

        cookie[id] = {
            battletag: battletag,
            pseudo: pseudo,
            hashtag: hashtag
        }

        fs.writeFile("./cookie.json", JSON.stringify(cookie));
        message.delete();
    }

/*

    if (message.toString().substring(0, 5) === "!fox-") {
        var arg;
        var username = message.member.id;
        var battletag = message.toString().substring(5);
        var pseudo = message.toString().substring(5, message.toString().indexOf('#'));
        var hashtag = message.toString().substring(message.toString().indexOf('#') + 1);

        message.member.addRole("366713511335690242");

        message.delete();
        arg = {username: username, battletag: battletag, pseudo: pseudo, hashtag: hashtag};
        //connection.connect();
        connection.query('INSERT INTO foxUsers SET ?', arg);
        //connection.end();

    }*/

    /***************
     * COTE RANKED *
     ***************/

    // Stat ranked
    if (message.content === "?stats") {
        var id = message.member.id;

        if (!cookie[id]) {
            // Ecrire message pour qu'il fasse la commande !fox avant
            return ;
        }

        var xhr = new XMLHttpRequest();
        var member = cookie[id].pseudo + '-' + cookie[id].hashtag;

        xhr.open("GET", "https://owapi.net/api/v3/u/"+ member +"/stats", false);
        xhr.send();
        xhr = JSON.parse(xhr.responseText);

        var stat = {
            rankedSign: getRankedSign(xhr.eu.stats.competitive.overall_stats.comprank),
            name: cookie[id].pseudo,
            avatar: xhr.eu.stats.competitive.overall_stats.avatar,
            games: xhr.eu.stats.competitive.overall_stats.games,
            win: xhr.eu.stats.competitive.overall_stats.wins,
            winrate: xhr.eu.stats.competitive.overall_stats.win_rate,
            timePlayed: xhr.eu.stats.competitive.game_stats.time_played,
            level: (xhr.eu.stats.competitive.overall_stats.prestige * 100) + xhr.eu.stats.competitive.overall_stats.level,
            cote: xhr.eu.stats.competitive.overall_stats.comprank,
            main: getMain(member),
            KD: xhr.eu.stats.competitive.game_stats.kpd,
            mostElim: xhr.eu.stats.competitive.game_stats.eliminations_most_in_game,
            totalElim: xhr.eu.stats.competitive.game_stats.eliminations,
            mostDamage: xhr.eu.stats.competitive.game_stats.all_damage_done_most_in_game,
            totalDamage: xhr.eu.stats.competitive.game_stats.all_damage_done,
            mostHeal: xhr.eu.stats.competitive.game_stats.healing_done_most_in_game,
            totalHeal: xhr.eu.stats.competitive.game_stats.healing_done,
            mostSoloKill: xhr.eu.stats.competitive.game_stats.solo_kills_most_in_game,
            totalSoloKill: xhr.eu.stats.competitive.game_stats.solo_kills,
            mostUlti: xhr.eu.stats.competitive.game_stats.final_blows_most_in_game,
            totalUlti: xhr.eu.stats.competitive.game_stats.final_blows,
            mostKillEnv: xhr.eu.stats.competitive.game_stats.environmental_kills_most_in_game,
            totalKillEnv: xhr.eu.stats.competitive.game_stats.environmental_kills,
            mostObjKill: xhr.eu.stats.competitive.game_stats.objective_kills_most_in_game,
            totalObjKill: xhr.eu.stats.competitive.game_stats.objective_kills,
            mostOffKill: xhr.eu.stats.competitive.game_stats.offensive_assists_most_in_game,
            totalOffKill: xhr.eu.stats.competitive.game_stats.offensive_assists,
            mostDefKill: xhr.eu.stats.competitive.game_stats.defensive_assists_most_in_game,
            totalDefKill: xhr.eu.stats.competitive.game_stats.defensive_assists,
            mostObjTime: xhr.eu.stats.competitive.game_stats.objective_time_most_in_game,
            totalObjTime: xhr.eu.stats.competitive.game_stats.objective_time,
            mostTimeFire: xhr.eu.stats.competitive.game_stats.time_spent_on_fire_most_in_game,
            totalTimeFire: xhr.eu.stats.competitive.game_stats.time_spent_on_fire
        };


        const embed = new Discord.RichEmbed();
        embed.setAuthor(stat.name, stat.avatar)
            .setColor(15377215)
            //.setThumbnail(stat.avatar)
            .setDescription(stat.games + " parties compétitives jouées ("+Math.round(stat.winrate)+"% gagnées) sur "+Math.round(stat.timePlayed)+"H")
            //.addBlankField()
            .setTitle("MasterOverwatch")
            .setURL("https://masteroverwatch.com/profile/pc/eu/" + member)
            .addField("Level", stat.level, true)
            .addField("Rang", stat.cote + stat.rankedSign, true)
            .addField("Main", stat.main, true)
            .addField("Eliminations", "*Best*: " + stat.mostElim + "\n*Total*: " + stat.totalElim, true)
            .addField("Dommages", "*Best*: " + stat.mostDamage + "\n*Total*: " + stat.totalDamage, true)
            .addField("Healing", "*Best*: " + stat.mostHeal + "\n*Total*: " + stat.totalHeal, true)
            .addField("Solo Kills", "*Best*: " + stat.mostSoloKill + "\n*Total*: " + stat.totalSoloKill, true)
            .addField("Ulti", "*Best*: " + stat.mostUlti + "\n*Total*: " + stat.totalUlti, true)
            .addField("Environnement", "*Best*: " + stat.mostKillEnv + "\n*Total*: " + stat.totalKillEnv, true)
            .addField("Objective Kills", "*Best*: " + stat.mostObjKill + "\n*Total*: " + stat.totalObjKill, true)
            .addField("Offensive Assists", "*Best*: " + stat.mostOffKill + "\n*Total*: " + stat.totalOffKill, true)
            .addField("Defensive Assists", "*Best*: " + stat.mostDefKill + "\n*Total*: " + stat.totalDefKill, true)
            .addField("Objective Time", "*Best*: " + getTime(stat.mostObjTime) + "\n*Total*: " + getTime(stat.totalObjTime), true)
            .addField("Time On Fire", "*Best*: " + getTime(stat.mostTimeFire) + "\n*Total*: " + getTime(stat.totalTimeFire), true);

        message.channel.send({embed: embed});

    }


    // Cote Ranked
    if (message.content === "?cote") {
        var user = message.member.id;

        //connection.connect();
        connection.query('SELECT pseudo, hashtag FROM foxUsers WHERE username = ?' , user, function(error, results, fields) {
            var xhr = new XMLHttpRequest();
            var cote = 0, rate = 0.0, win = 0, lose = 0;
            var member = results[0]['pseudo'] + '-' + results[0]['hashtag'];

            xhr.open("GET", "https://owapi.net/api/v3/u/"+ member +"/stats", false);
            xhr.send();
            xhr = JSON.parse(xhr.responseText);
            cote = xhr.eu.stats.competitive.overall_stats.comprank;
            win = xhr.eu.stats.competitive.overall_stats.wins;
            lose = xhr.eu.stats.competitive.overall_stats.losses;
            rate = xhr.eu.stats.competitive.overall_stats.win_rate;
            message.channel.send("La côte actuelle de "+ results[0]['pseudo'] +" est de " + cote + getRankedSign(cote) + "\n"+win+" V | "+lose+" D      "
                + rate +"%");
        });
        //connection.end();
    }


    // Mains Ranked
    if (message.content === "?main") {
        var user = message.member.id;

        //connection.connect();
        connection.query('SELECT pseudo, hashtag FROM foxUsers WHERE username = ?' , user, function(error, results, fields) {
            var xhr = new XMLHttpRequest();
            var cote = 0, rate = 0.0, win = 0, lose = 0;
            var member = results[0]['pseudo'] + '-' + results[0]['hashtag'];

            xhr.open("GET", "https://owapi.net/api/v3/u/"+ member +"/stats", false);
            xhr.send();
            xhr = JSON.parse(xhr.responseText);
            cote = xhr.eu.stats.competitive.overall_stats.comprank;
            win = xhr.eu.stats.competitive.overall_stats.wins;
            lose = xhr.eu.stats.competitive.overall_stats.losses;
            rate = xhr.eu.stats.competitive.overall_stats.win_rate;
            message.channel.send("La côte actuelle de "+ results[0]['pseudo'] +" est de " + cote + getRankedSign(cote) + "\n"+win+" V | "+lose+" D      "
                + rate +"%");
        });
    }

    /****************
     * Mains Ranked *
     ****************/

    if (message.content === "?mataag_main") {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://owapi.net/api/v3/u/MataagFOX-2394/heroes", false);
        xhr.send();
        xhr = JSON.parse(xhr.responseText);
        var rate_dva = 0.0, rate_doom = 0.0, rate_ana = 0.0;
        rate_dva = xhr.eu.heroes.stats.competitive.dva.general_stats.win_percentage;
        rate_doom = xhr.eu.heroes.stats.competitive.doomfist.general_stats.win_percentage;
        rate_ana = xhr.eu.heroes.stats.competitive.ana.general_stats.win_percentage;
        message.channel.send("<:dva:365114092962316288> "+rate_dva*100+"%\n<:doomfist:365123840977928192> "+rate_doom*100+"%\n<:ana:365114729510862848> "+rate_ana*100+"%");
    }

    if (message.content === "?zolowa_main") {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://owapi.net/api/v3/u/ZolowaFOX-2615/heroes", false);
        xhr.send();
        xhr = JSON.parse(xhr.responseText);
        var rate_winston = 0.0, rate_soldier = 0.0, rate_mercy = 0.0
        console.log(xhr.competitive);
        rate_winston = xhr.eu.heroes.stats.competitive.winston.general_stats.win_percentage;
        rate_soldier = xhr.eu.heroes.stats.competitive.soldier.general_stats.win_percentage;
        rate_mercy = xhr.eu.heroes.stats.competitive.mercy.general_stats.win_percentage;
        message.channel.send("<:winston:365115986367610880> "+rate_winston*100+"%\n<:soldier:365115966478352385> "+rate_soldier*100+"%\n<:mercy:365115905799356416>"+rate_mercy+"%");
    }

    if (message.content === "?saloukai_main") {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://owapi.net/api/v3/u/SaloukaiFOX-2596/heroes", false);
        xhr.send();
        xhr = JSON.parse(xhr.responseText);
        var rate_rein = 0.0, rate_road = 0.0, rate_junkrat = 0.0;
        rate_rein = xhr.eu.heroes.stats.competitive.reinhardt.general_stats.win_percentage;
        rate_road = xhr.eu.heroes.stats.competitive.roadhog.general_stats.win_percentage;
        rate_junkrat = xhr.eu.heroes.stats.competitive.junkrat.general_stats.win_percentage;
        message.channel.send("<:reinhardt:365115929253773313> "+rate_rein*100+"%\n<:roadhog:365115948094717952> "+rate_road*100+"%\n<:junkrat:365115872337068032> "+rate_junkrat*100+"%");
    }


    /***********
     * YOUTUBE *
     ***********/

    if (message.content === "?teamFOX") {
        message.channel.send("https://www.youtube.com/channel/UCodeOIGzWo6MeClA1XKdlZg");
    }

    if (message.content === "?teamFOX_presentation") {
        message.channel.send("https://www.youtube.com/watch?v=Uzs9bJdMsMY");
    }

    /********
     * HELP *
     ********/

    if (message.content === "?help") {
        const embed = new Discord.RichEmbed();
        embed.setColor(9877215)
            .addField("Commandes\n", "**!fox BattleTag** : Commande indispensable pour accéder à toutes les commandes\n"
                +"**?stats** : Statistiques globales OverWatch\n"
                +"**?cote** : Informations sur votre rang");

        message.channel.send({embed: embed});
    }
});

Bot.login("MzY0ODI1MjUyMDI0NDE4MzE1.DLYyag.zeqYk8QvtzbDhZg1bYXXWqrHtOA");