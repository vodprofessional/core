/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(d){function h(k){var h=k.handler,e=(k.namespace||"").toLowerCase().split(" "),e=d.map(e,function(a){return a.split(".")});if(1!==e.length||""!==e[0]&&"autocomplete"!==e[0])k.handler=function(a){if(this===a.target||!/textarea|select/i.test(a.target.nodeName)&&"text"!==a.target.type&&"true"!=$(a.target).prop("contenteditable")){var c="keypress"!==a.type&&d.hotkeys.specialKeys[a.which],f=String.fromCharCode(a.which).toLowerCase(),b="",g={};a.altKey&&"alt"!==c&&(b+="alt_");a.ctrlKey&&"ctrl"!==
c&&(b+="ctrl_");a.metaKey&&!a.ctrlKey&&"meta"!==c&&(b+="meta_");a.shiftKey&&"shift"!==c&&(b+="shift_");c?g[b+c]=!0:(g[b+f]=!0,g[b+d.hotkeys.shiftNums[f]]=!0,"shift_"===b&&(g[d.hotkeys.shiftNums[f]]=!0));c=0;for(f=e.length;c<f;c++)if(g[e[c]])return h.apply(this,arguments)}}}d.hotkeys={version:"0.8+",specialKeys:{8:"backspace",9:"tab",13:"return",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",
45:"insert",46:"del",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",188:",",190:".",191:"/",224:"meta"},shiftNums:{"`":"~",1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")","-":"_","=":"+",";":": ","'":'"',",":"<",".":">","/":"?","\\":"|"}};d.each(["keydown","keyup","keypress"],function(){d.event.special[this]=
{add:h}})})(jQuery);
