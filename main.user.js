// ==UserScript==
// @name         OSM Toolbox
// @namespace    OSM.Tactic.Toolbox
// @version      0.1
// @downloadURL  https://github.com/Sycareus/OSM-Toolbox/blob/master/main.user.js
// @updateURL    https://github.com/Sycareus/OSM-Toolbox/blob/master/main.user.js
// @description  Suite d'outils pour managers flemmards
// @author       Sycarus
// @include      http://*.onlinesoccermanager.com/Team/Tactic
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// ==/UserScript==

var OSM_STORE_BASE = "osm.toolbox.";
var NB_TACTS = 10;

var DEFAULT_TACT = {
    style: 2,
    compo: 2,
    att: 2,
    mil: 1,
    def: 0,
    marking: false,
    hj: false,
    mental: 65,
    tempo: 70,
    pressing: 35,
    name: "t"
};

/*var OSM_TACTS = OSM_TACTS || */init_tacts();

var tb_holder1 = "<div class='frameContent transparentContent'>  \
                    <div class='frameContentImages'>  \
                       <div class='frameContentTopLeft blue'></div> \
                       <div class='frameContentTopMiddleSidebar blue'><span class='frameContentTopTitle'>";

var tb_holder2 = "</span></div> \
                       <div class='frameContentTopRight blue'></div> \
                    </div>  \
                    <div class='frameContentHolder noPadding'>   \
                       <div class='frameContentContainer'>  \
                          <div class='divAssistantSidebarContent' id='";

var tb_holder3 = "'></div>  \
                          <div class='divAssistantSidebarBottom'></div>  \
                       </div>  \
                    </div>  \
                 </div>";

$('#divSidebarRight').appendChild(tb_holder1 + "Tactiques" + tb_holder2 + "tb-tacts" + tb_holder3);
$('#divSidebarRight').appendChild(tb_holder1 + "Curseurs" + tb_holder2 + "tb-cursors" + tb_holder3);

for(var i = 1 ; i <= NB_TACTS ; i++)
{
    var tact = GM_getValue(OSM_STORE_BASE + "tact." + i, "{t : 't'}");
    var namet = !(tact) || !(tact.name) || tact.name === "t" ? "Tactique " + i : tact.name;
    $('#tb-tacts').appendChild("<div id='tact" + i + "' class='tb-tact'>  \
                             <h3>"+ namet + "</h3>  \
                             <input type='button' onclick='tb_rename(" + i + ")' class='tb-btn-rename customGreenButton'>(renommer)</input> \
                             <div style='clear: both'></div>  \
                             <input type='button' onclick='tb_apply(" + i + ")' class='tb-btn-apply customGreenButton'>Appliquer</input>   \
                             <input type='button' onclick='tb_change(" + i + ")' class='tb-btn-save customGreenButton'>Enregistrer</input> \
                          </div>");
}

$('#tb-tacts').appendChild("<div class='tb-tact'><input type='button' onclick='tb_export()' class='tb-btn-export customGreenButton'>Exporter tactique</input></div>");

var tb_cursors_names = ["Mentality", "Tempo", "Pressing"];

for (var e in tb_cursors_names)
{
    $('#tb-cursors').appendChild("<label for='tb-in-" + tb_cursors_names[e] +"'>" + tb_cursors_names[e] + "</label> \
    <input type='number' class='us_curs_box' max='100' min='0' id='tb-in-" + tb_cursors_names[e] + "' value='" + $('#' + tb_cursors_names[e]).value + "' \
    onchange='function(){document.getElementById(\'Tempo\').value = this.value;}' style='width:126px;text-align:center;font-size:17px;margin-top:10px;'></input>");
    $('#' + tb_cursors_names[e]).onchange = function() {$('#tb-in-' + tb_cursors_names[e]).value = this.value;};
}

function init_tacts()
{
    for (var n = 1 ; n <= NB_TACTS ; i++) {
        if (GM_getValue(OSM_STORE_BASE + "tact." + n, "n") === "n") {
            GM_setValue(OSM_STORE_BASE + "tact." + n, DEFAULT_TACT);
        }
    }
   // return true;
}

function tb_rename(tid)
{
    var t = GM_getValue(OSM_STORE_BASE + "tact." + tid, DEFAULT_TACT);
    var new_name = prompt("Modifiez le nom de la tactique :");
    $('#tact' + tid).find('h3').innerHTML = new_name;
    t.name = new_name;
    GM_setValue(OSM_STORE_BASE + "tact." + tid, t);
    alert("Tactique renommée en " + new_name);
}

function tb_apply(tid)
{
    var t = GM_getValue(OSM_STORE_BASE + "tact." + tid, DEFAULT_TACT);
    document.getElementById('hiddenTacticsForm_Style').value = t.style;
    document.getElementById('hiddenTacticsForm_OverallMatchTactics').value = t.compo;
    document.getElementById('edtAttack').value = t.att;
    document.getElementById('edtMidfield').value = t.mil;
    document.getElementById('edtDefence').value = t.def;
    document.getElementById('hiddenTacticsForm_Marking').value = t.marking;
    document.getElementById('hiddenTacticsForm_OffsideTrap').value = t.hj;
    document.getElementById('Mentality').value = t.mental;
    document.getElementById('Tempo').value = t.tempo;
    document.getElementById('Pressing').value = t.pressing;
    
    document.getElementById('btnConfirm2').name = "SUBMIT";
    document.forms[0].submit();
    alert("Tactique appliquée, chargement en cours...");
}

function tb_change(tid)
{
    var t = GM_getValue(OSM_STORE_BASE + "tact." + tid, DEFAULT_TACT);
    
    t.style = parseInt(document.getElementById('hiddenTacticsForm_Style').value);
    t.compo = parseInt(document.getElementById('hiddenTacticsForm_OverallMatchTactics').value);
    t.att = parseInt(document.getElementById('edtAttack').value);
    t.mid = parseInt(document.getElementById('edtMidfield').value);
    t.def = parseInt(document.getElementById('edtDefence').value);
    t.marking = document.getElementById('hiddenTacticsForm_Marking').value;
    t.hj = document.getElementById('hiddenTacticsForm_OffsideTrap').value;
    t.mental = document.getElementById('Mentality').value;
    t.tempo = document.getElementById('Tempo').value;
    t.pressing = document.getElementById('Pressing').value;
    
    GM_setValue(OSM_STORE_BASE + "tact." + tid, t);
    alert("Tactique " + $('#tact' + tid).find('h3').innerHTML + " modifiée.");
}

GM_addStyle('\
   .tb_curs_box\
   {\
    	padding: 5px;\
	    background: #eeeeee;\
	    border: 2px solid #30BA35;\
	    border-radius: 10px;\
	    -moz-border-radius: 15px;\
	    -webkit-border-radius: 15px;\
    }\
    .tb-btn-rename { float: right; }  \
    .tb-btn-save { width: 45%; }  \
    .tb-btn-apply { width: 45%; }  \
    .tb-tacts { padding: 10 5px; }  \
    .tb-tact { padding: 10 0px; }  \
');

function tb_export()
{
    var style = parseInt(document.getElementById('hiddenTacticsForm_Style').value);
    var compo = parseInt(document.getElementById('hiddenTacticsForm_OverallMatchTactics').value);
    var att = parseInt(document.getElementById('edtAttack').value);
    var mid = parseInt(document.getElementById('edtMidfield').value);
    var def = parseInt(document.getElementById('edtDefence').value);
    var mark = document.getElementById('hiddenTacticsForm_Marking').value;
    var hj = document.getElementById('hiddenTacticsForm_OffsideTrap').value;
    var mental = parseInt(document.getElementById('Mentality').value);
    var tempo = parseInt(document.getElementById('Tempo').value);
    var pressing = parseInt(document.getElementById('Pressing').value);
    
    var styles = ["MOD", "NOR", "AGR", "TOR"];
    var compos = ["LB", "P10", "SLA", "CA", "TDL"];
    var line_att_mil = ["D", "M", "A"];
    var line_def = ["D", "L", "M"];
    
    var res = "" + compos[compo] + " " + styles[style] + " " + line_att_mil[att] + line_att_mil[mid] + line_def[def] + " " + mental + "/" + tempo + "/" + pressing + " ";
    res = res + mark ? "I" : "Z" + " " + hj ? "O" : "N";
    
    alert(res);
}

/* 
 * Note :
 * 0, 1, 2, 3 : style : mod, norm, agr, tor
 * 0, 1, 2, 3, 4 : mode : lb, p10, ailes, ca, tdl
 * 0, 1, 2 : lignes : def, mil, att
 * marking : true si indi, false si zone
 * hj : true si oui, false si non
 * 
*/