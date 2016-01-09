// ==UserScript==
// @name         OSM Toolbox
// @namespace    OSM.Tactic.Toolbox
// @version      0.1
// @downloadURL  https://github.com/Sycareus/OSM-Toolbox/blob/master/main.user.js
// @updateURL    https://github.com/Sycareus/OSM-Toolbox/blob/master/main.user.js
// @description  Suite d'outils pour managers flemmards
// @author       Sycarus
// @include      http://*.onlinesoccermanager.com/Team/Tactic
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
    marking: "false",
    hj: "false",
    mental: 65,
    tempo: 70,
    pressing: 35,
    name: "t"
};

var OSM_TACTS = OSM_TACTS || init_tacts();

var tb_holder1 = "<div class='frameContent transparentContent'>  \
                    <div class='frameContentImages'>  \
                       <div class='frameContentTopLeft blue'></div> \
                       <div class='frameContentTopMiddleSidebar blue'><span class='frameContentTopTitle'>";

var tb_holder2 = "</span></div> \
                       <div class='frameContentTopRight blue'></div> \
                    </div>  \
                    <div class='frameContentHolder noPadding'>   \
                       <div class='frameContentContainer'>  \
                          <div class='divAssistantSidebarContent'  style='background-color: #fff; !important' id='";

var tb_holder3 = "'></div>  \
                          <div class='divAssistantSidebarBottom'></div>  \
                       </div>  \
                    </div>  \
                 </div>";

$('#divSidebarRight').empty();

$('#divSidebarRight').append(tb_holder1 + "Tactiques" + tb_holder2 + "tb-tacts" + tb_holder3);
$('#divSidebarRight').append(tb_holder1 + "Curseurs" + tb_holder2 + "tb-cursors" + tb_holder3);

$('#tb-tacts').append("<div class='tb-tact'><input type='button' class='tb-btn-export customGreenButton' id='tb-export-btn' value='Exporter tactique' style='margin-top:2px; margin-bottom:0;'></div>");
$('#tb-export-btn').on('click', function() { tb_export(); });

for(var i = 1 ; i <= NB_TACTS ; i++)
{
    var tact = JSON.parse(GM_getValue(OSM_STORE_BASE + "tact." + i, JSON.stringify(DEFAULT_TACT)));
    var namet = tact.name === "t" ? ("Tactique " + i) : tact.name;
    $('#tb-tacts').append("<div id='tact" + i + "' class='tb-tact'>  \
                             <h3 class='tb-name' id='tb-rn-" + i + "'>"+ namet + "</h3>  \
                             <input type='button' id='tb-ap-" + i + "' class='tb-btn-apply customGreenButton' value='Appliquer'>   \
                             <input type='button' id='tb-en-" + i + "' class='tb-btn-save customGreenButton' value='Enregistre'> \
                          </div>");
    $('#tb-ap-' + i).on('click', function() { tb_apply(parseInt(this.id.toString().substring(6))); });
    $('#tb-en-' + i).on('click', function() { tb_change(parseInt(this.id.toString().substring(6))); });
    $('#tb-rn-' + i).on('click', function() { tb_rename(parseInt(this.id.toString().substring(6))); });
}

$('#tb-tacts').append("<div class='tb-tact'><input type='button' class='tb-btn-export customGreenButton' id='tb-tof-btn' value='Tactof - random' style='width: 97%; margin-top:2px; margin-bottom:0;'></div>");
$('#tb-tof-btn').on('click', function() { tb_rantof(); });

var tb_cursors_names = ["Mentality", "Tempo", "Pressing"];

for (var e in tb_cursors_names)
{
    $('#tb-cursors').append(" \
    <input type='number' class='tb_curs_box' max='100' label='" + tb_cursors_names[e] + "' min='0' id='tb-in-" + tb_cursors_names[e] + "' value='" + document.getElementById(tb_cursors_names[e]).value + "' \
    style='width:126px;text-align:center;font-size:17px;margin-top:10px;'>");
    $('#div'+tb_cursors_names[e]).on('slidestop', function() { document.getElementById('tb-in-' + this.id.toString().substring(3)).value = document.getElementById(this.id.toString().substring(3)).value;} );
    $('#tb-in-' + tb_cursors_names[e]).on('change', function() { $("#div" + this.id.toString().substring(6)).slider("value", this.value); document.getElementById(this.id.toString().substring(6)).value = this.value;} );
}

function init_tacts()
{
    for (var n = 1 ; n <= NB_TACTS ; n++) {
        if (GM_getValue(OSM_STORE_BASE + "tact." + n, "") === "") {
            GM_setValue(OSM_STORE_BASE + "tact." + n, JSON.stringify(DEFAULT_TACT));
        }
    }
   // return true;
}

function tb_rename(tid)
{
    var t = JSON.parse(GM_getValue(OSM_STORE_BASE + "tact." + tid, JSON.stringify(DEFAULT_TACT)));
    var new_name = unsafeWindow.prompt("Modifiez le nom de la tactique :", $('#tb-rn-' + tid).html());
    if (new_name && new_name.trim()) {
       $('#tb-rn-' + tid).html(new_name);
       t.name = new_name;
       GM_setValue(OSM_STORE_BASE + "tact." + tid, JSON.stringify(t));
    }
}

function tb_apply(tid)
{
    var t = JSON.parse(GM_getValue(OSM_STORE_BASE + "tact." + tid, JSON.stringify(DEFAULT_TACT)));
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
    unsafeWindow.alert("Tactique appliquée, chargement en cours...");
}

function tb_change(tid)
{
    var t = JSON.parse(GM_getValue(OSM_STORE_BASE + "tact." + tid, JSON.stringify(DEFAULT_TACT)));

    t.style = parseInt(document.getElementById('hiddenTacticsForm_Style').value);
    t.compo = parseInt(document.getElementById('hiddenTacticsForm_OverallMatchTactics').value);
    t.att = parseInt(document.getElementById('edtAttack').value);
    t.mil = parseInt(document.getElementById('edtMidfield').value);
    t.def = parseInt(document.getElementById('edtDefence').value);
    t.marking = document.getElementById('hiddenTacticsForm_Marking').value;
    t.hj = document.getElementById('hiddenTacticsForm_OffsideTrap').value;
    t.mental = parseInt(document.getElementById('Mentality').value);
    t.tempo = parseInt(document.getElementById('Tempo').value);
    t.pressing = parseInt(document.getElementById('Pressing').value);

    GM_setValue(OSM_STORE_BASE + "tact." + tid, JSON.stringify(t));
    unsafeWindow.alert("Tactique \"" + $("#tb-rn-" + tid).html() + "\" modifiée.");
}

GM_addStyle('\
   .tb_curs_box\
   {\
    	padding: 5px;\
	    background: #eeeeee;\
	    border: 2px solid #30BA35;\
	    border-radius: 3px;\
	    -moz-border-radius: 3px;\
	    -webkit-border-radius: 3px;\
    }\
    .tb-btn-export { font-size: 13px; margin-bottom: 3px;}  \
    .tb-btn-save { width: 45%; padding: 5px 1px; font-size: 12px; }  \
    .tb-btn-apply { width: 45%; padding: 5px 1px; font-size: 12px; }  \
    .tb-tacts { padding: 10 5px; }  \
    .tb-tact { padding: 10px 0 0 0; }  \
    .tb-name { margin: 7px 0; display: block;}  \
    #tb-tacts { padding-top: 0; } \
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
    res = res + (mark === 'true' ? "I" : "Z") + " " + (hj === 'true' ? "O" : "N");

        $.get("http://fr.onlinesoccermanager.com/League/Results", function (d) {
            // parse match result here, handle start of league exception (no match)
            if ($(d).find('#divPossessionLeft').length) {
                // manager is right or left ?
                var isLeft = $(d).find('#tblMatchDetails').find('tbody').find('tr').find('td').find('a').html() === $(d).find('#divProfileName').html();
                // get compo to the manager's side
                var compo = $(d).find('#tblMatchDetails').find('tbody').find('tr').next().next().find(isLeft ? ".left" : ".right").html().replace(/-/g, '').replace(/ /g, '').trim();
                var sumRight = 0;
                var sumLeft = 0;
                var pInfo;
                // compute left team value
                var leftPanel = $(d).find('#tblPlayerGradesRight').prev();
                $.ajaxSetup({async: false});
                $(leftPanel).find('tbody').find('tr').each(function () {
                    pInfo = $(this).find('td').next().find('a');
                    GM_log($(pInfo).next());
                    if ((!($(pInfo).next().length) || ($(pInfo).next().length && $(pInfo).next().prop('src').toString().indexOf('icon_subin.png') === -1)) && $(pInfo).data('nr') && $(pInfo).data('compnr') && $(pInfo).data('teamnr'))
                    $.get("http://fr.onlinesoccermanager.com/Player/Profile?PlayerNr=" + $(pInfo).data('nr') + "&CompNr=" + $(pInfo).data('compnr') + "&TeamNr=" + $(pInfo).data('teamnr'), function (r) {
                        sumLeft += parseInt($(r).find('#trEstVal').find('td').next().html().replace(/€/g, '').replace(/ /g, '').replace(/\u00a0/g, '').replace(/&nbsp;/g, '').trim());
                    });
                });
                // compute right team value
                var rightPanel = $(leftPanel).next().find('tbody');
                $(rightPanel).find('tr').each(function () {
                    pInfo = $(this).find('td').next().find('a');
                    GM_log($(pInfo).next());
                    if ((!($(pInfo).next().length) || ($(pInfo).next().length && $(pInfo).next().prop('src').toString().indexOf('icon_subin.png') === -1)) && $(pInfo).data('nr') && $(pInfo).data('compnr') && $(pInfo).data('teamnr'))
                    $.get("http://fr.onlinesoccermanager.com/Player/Profile?PlayerNr=" + $(pInfo).data('nr') + "&CompNr=" + $(pInfo).data('compnr') + "&TeamNr=" + $(pInfo).data('teamnr'), function (r) {
                        sumRight += parseInt($(r).find('#trEstVal').find('td').next().html().replace(/€/g, '').replace(/ /g, '').replace(/\u00a0/g, '').replace(/&nbsp;/g, '').trim());
                    });
                });
                res = compo + " " + res + "\nVal team : " + (isLeft ? sumLeft : sumRight) + "€\nVal adv  : " + (isLeft ? sumRight : sumLeft) + "€";
            }
            unsafeWindow.alert(res);
            $.ajaxSetup({async: true});
    });
}

function tb_rantof()
{
    document.getElementById('hiddenTacticsForm_Style').value = Math.round(Math.random() * 3);
    document.getElementById('hiddenTacticsForm_OverallMatchTactics').value = Math.round(Math.random() * 4);
    document.getElementById('edtAttack').value = Math.round(Math.random() * 2);
    document.getElementById('edtMidfield').value = Math.round(Math.random() * 2);
    document.getElementById('edtDefence').value = Math.round(Math.random() * 2);
    document.getElementById('hiddenTacticsForm_Marking').value = Math.round(Math.random()) ? "true" : "false";
    document.getElementById('hiddenTacticsForm_OffsideTrap').value = Math.round(Math.random()) ? "true" : "false";
    document.getElementById('Mentality').value = Math.round(Math.random() * 100);
    document.getElementById('Tempo').value = Math.round(Math.random() * 100);
    document.getElementById('Pressing').value = Math.round(Math.random() * 100);

    document.getElementById('btnConfirm2').name = "SUBMIT";
    document.forms[0].submit();
    unsafeWindow.alert("Lettof a encore frappé...");
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
