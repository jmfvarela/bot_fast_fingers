var word_string, words; 		//String = enthält die Wörter; Array(words) = enthält die Wörter aufgesplittet in einem Array
var row1_string = ''; 			//enthält die einzugebenen Wörter der 1. Reihe
var i;
var word_pointer = 0; 			//markiert das aktuelle Wort welches getippt werden soll
var user_input_stream = ''; 	//sammelt alle Tastatureingaben des Users
var countdown; 					//zeigt die Zeit an und wird runtergezählt
var row_counter = 0; 			//zählt die Anzahl der Zeilensprünge
var eingabe; 					//prüfvariable => alles was im Inputfeld drinsteht wird hier zwischengespeichert und weiterverarbeitet (manchmal reagiert der Keylistener für das Leerzeichen nicht schnell genug, z.b. "hallo w" wird dann übertragen, daher erfolgt zu erst eine weiterverarbeitung)
var start_time = 0;				//die Startzeit in Millisekunden
var end_time = 0;				//die Endzeit in Millisekunden
var setval = "";				//die Variable für den Timer/setInterval
var line_height = 0;			//Höhe des Zeilensprungs
var loading = 0;

var error_wpm = 0;				//fallback if ajax call fails => user can still see his result
var error_keystrokes = 0;
var error_correct = 0;
var error_wrong = 0;
var correction_counter = 0;

var _gaq = _gaq || [];
var test_ausgefuehrt = 0;
var selected = 0;
var pre_inputvalue = '';
var inputvalue = '';

var keys = {};					//liest die gedrückten Tasten ein, wird genutzt für Mac/Safari "Smart" Reload

var input_key_value = 32;
var $inputfield = $("input#inputfield");
var $row1 = $("#row1");
var $reloadBtn = $("#reload-btn");
var $row1_span_wordnr;

var afk_timer = 0; //counts up if user hasn't typed anything, resets after a keystroke is pressed; if afk_timer bigger 10 seconds, don't post result

$(document).ready(function()
{
	restart();
	activate_keylistener();

	var win_width = $(window).width();

	//reload-button
	//oder "F5"-Taste abfangen
	$(document).keydown(function(event) {
		if (event.which == 116 && loading == 0) {
			loading = 1;
			restart();
			return false;
		}

		keys[event.which] = true;
	});

	$(document).keyup(function (event) {
		delete keys[event.which];
	});

	$("#reload-btn").on('click', function(){
		restart();
		return false;
	});
});


function restart() {
	//wird beim start und beim klick auf "restart" aufgerufen
	//ruft initialisierungsfunktionen auf und setzt werte zurück auf den startwert
	word_string = '';
	words = '';
	row1_string = '';
	word_pointer = 0;
	user_input_stream = '';
	countdown = 60;
	cd_started = 0;
	previous_position_top = 0;
	row_counter = 0;
	eingabe = '';
	start_time = 0;
	end_time = 0;
	//start_time_set = 0;

	//just to count everything if the ajax-call fails
	error_wpm = 0;
	error_keystrokes = 0;
	error_correct = 0;
	error_wrong = 0;
	correction_counter = 0;

    selected = 0;
    pre_inputvalue = '';
    inputvalue = '';

	$("#timer").text("1:00");

	window.clearInterval(setval);
    setval = "";

	setTimeout(function() {
		$("#wordlist").text("state|feet|write|thought|why|air|often|watch|thing|any|must|him|day|hand|where|line|sound|its|night|these|down|our|below|the|sometimes|home|really|always|three|hand|thing|school|in|sea|could|if|this|world|important|try|different|school|city|who|car|just|head|each|again|now|add|always|talk|part|sea|side|second|few|people|life|world|as|move|often|water|began|run|play|both|side|said|long|something|take|your|together|last|on|time|them|eat|boy|never|learn|why|letter|form|not|quite|children|come|part|first|are|word|quickly|above|what|know|study|while|girl|spell|above|kind|would|such|come|move|an|tree|or|my|below|tree|under|as|and|does|house|keep|near|miss|read|next|book|like|his|back|quite|picture|without|than|but|we|quickly|plant|into|form|being|while|what|grow|let|will|then|right|which|young|here|keep|very|some|call|little|time|another|men|those|every|put|stop|need|day|have|the|been|his|father|you|like|plant|on|read|these|well|for|close|may|between|book|man|keep|men|while|its|later|than|up|old|begin|found|watch|same|most|big|men|have|been|right|each|different|new|river|begin|are|being|like|change|long|hear|don't|car|make|thought|about|man|animal|under|see|about|hard|also|began|than|when|went|eat|children|question|say|people|are|number|us|day|answer|away|all|follow|life|Indian|but|high|mountain|grow|spell|end|got|look|even|go|some|hard|if|earth|us|only|own|make|hear|how|at|before|idea|here|soon|start|thing|come|did|our|before|mountain|father|they|enough|sometimes|go|had|because|one|oil|us|as|point|came|city|because|tell|see|story|country|all|look|big|name|watch|had|start|tell|no|eye|made|could|do|high|same|think|small|may|run|could|off|head|there|want|home|America|who|question|along|year|close|other|took|list|also|sentence|oil|my|can|three|land|into|kind|more|paper|little|so|talk|mean|went|show|come|cut|plant|kind|live|boy|here|big|page|well|big|word|had|with|eye|through|do|put|girl|got|almost|help|people|America|on|name|only|head|quickly|us|land|house|while|saw|find|help|own|open|off|well|time|tell|ask|such|go|young|stop|often|last|this|four|could|from|make|look|watch|close|my|girl|little|this|where|feet|walk|water|around|did|put|way|eat|family|much|him|here|country|quick|important|has|face|been|read|there|time|still|really|book|have|try|it|spell|list|place|is|try|want|made|could|how|thought|answer|later|every|been|father|far|made|get|start|why|write|how|two|left|no|work|and|want|face|and|picture|animal|run|something|far|quickly|in|important|because|above|be|up|three|example|mile|idea|know|below|long|sound|really|first|letter|name|mean|some|don't|this|saw|form|line|me|Indian|who|change|animal|world|took|saw|left|one|paper|people|song|or|start|hear|it|right|keep|state|country|hand|start|it's|river|want|form|point|let|turn|big|hard|give|who|go|quite|keep|mountain|into|were|over|light|take|does|about|high|need|his|three|where|still|away|help|until|if|she|look|end|old|thing|see|watch|those|are|them|group|before|then|own|part|about|oil|more|they|year|walk|carry|us|every|make|under|write|place|down|tree|America|as|came|into|through|again|time|number|of|carry|have|my|miss|them|earth|next|plant|play|once|if|might|while|we|now|soon|last|study|they|idea|us|ask|light|need|later|year|put|made|over|grow|only|come|never|night|year|don't|from|the|learn|turn|so|get|good|something|man|oil|how|use|miss|was|which|no|grow|air|follow|you|our|question|white|end|the|play|change|other|few|watch|high|begin|may|if|as|children|does|old|me|work|to|being|found|story|also|night|water|enough|began|think|earth|on|of|thing|example|when|another|same|white|came|second|also|see|picture|these|hear|answer|list|spell|in|no|this|help|only|of|many|may|question|with|watch|plant|tell|because|along|into|only|what|begin|is|different|people|it's|study|that|these|next|girl|around|night|head|move|between|mountain|oil|why|let|two|enough|night|move|face|know|took|from|to|could|do|first|has|man|once|by|just|two|not|how|face|next|good|but|her|much|left|song|light|book|let|that|still|have|now|follow|school|old|head|which|together|word|have|of|they|put|so|if|too|would|add|they|use|came|me|without|should|second|below|here|stop|important|light|quite|through|animal|children|such|night|must|line|still|now|most|will|plant|were|white|never|no|seem|second|long|country|example|page|give|few|right|don't|first|any|see|small|so|one|go|state|mean|he|go|off|start|their|follow|miss|part|them|in|at|while|quickly|might|start|took|while|far|away|like|thing|get|up|river|line|really|through|answer|made|all|tree|will|mother|each|under|out|have|both|cut|second|think|soon|make|his|right|such|always|way|hard|could|mean|this|year|name|turn|read|make|us|see|go|add|different|keep|through|home|about|when|end|air|now|back|state|he|would|came|into|then|try|live|mother|old|and|song|about|change|life|boy|Indian|own|from|quickly|there|the|long|work|who|all|little|idea|story|before|any|help|boy|for|away|almost|miss|me|at|work|read|question|sea|school|back|are|write|be|run|miss|mile|cut|around|food|side|leave|another|close|know|want|quickly|think|take|turn|leave|thought|at|why|because|no|watch|very|feet|always|eat|eye|close|hand|some|its|country|picture|live|keep|than|really|sea|river|animal|put|time|be|sometimes|river|before|sometimes|world|high|then|that|food|world|sentence|form|grow|use|father|on|the|tell|by|set|from|next|large|open|show|quick|why|also|something|be|saw|well|find|above|so|state|feet|write|thought|why|air|often|watch|thing|any|must|him|day|hand|where|line|sound|its|night|these|down|our|below|the|sometimes|home|really|always|three|hand|thing|school|in|sea|could|if|this|world|important|try|different|school|city|who|car|just|head|each|again|now|add|always|talk|part|sea|side|second|few|people|life|world|as|move|often|water|began|run|play|both|side|said|long|something|take|your|together|last|on|time|them|eat|boy|never|learn|why|letter|form|not|quite|children|come|part|first|are|word|quickly|above|what|know|study|while|girl|spell|above|kind|would|such|come|move|an|tree|or|my|below|tree|under|as|and|does|house|keep|near|miss|read|next|book|like|his|back|quite|picture|without|than|but|we|quickly|plant|into|form|being|while|what|grow|let|will|then|right|which|young|here|keep|very|some|call|little|time|another|men|those|every|put|stop|need|day|have|the|been|his|father|you|like|plant|on|read|these|well|for|close|may|between|book|man|keep|men|while|its|later|than|up|old|begin|found|watch|same|most|big|men|have|been|right|each|different|new|river|begin|are|being|like|change|long|hear|don't|car|make|thought|about|man|animal|under|see|about|hard|also|began|than|when|went|eat|children|question|say|people|are|number|us|day|answer|away|all|follow|life|Indian|but|high|mountain|grow|spell|end|got|look|even|go|some|hard|if|earth|us|only|own|make|hear|how|at|before|idea|here|soon|start|thing|come|did|our|before|mountain|father|they|enough|sometimes|go|had|because|one|oil|us|as|point|came|city|because|tell|see|story|country|all|look|big|name|watch|had|start|tell|no|eye|made|could|do|high|same|think|small|may|run|could|off|head|there|want|home|America|who|question|along|year|close|other|took|list|also|sentence|oil|my|can|three|land|into|kind|more|paper|little|so|talk|mean|went|show|come|cut|plant|kind|live|boy|here|big|page|well|big|word|had|with|eye|through|do|put|girl|got|almost|help|people|America|on|name|only|head|quickly|us|land|house|while|saw|find|help|own|open|off|well|time|tell|ask|such|go|young|stop|often|last|this|four|could|from|make|look|watch|close|my|girl|little|this|where|feet|walk|water|around|did|put|way|eat|family|much|him|here|country|quick|important|has|face|been|read|there|time|still|really|book|have|try|it|spell|list|place|is|try|want|made|could|how|thought|answer|later|every|been|father|far|made|get|start|why|write|how|two|left|no|work|and|want|face|and|picture|animal|run|something|far|quickly|in|important|because|above|be|up|three|example|mile|idea|know|below|long|sound|really|first|letter|name|mean|some|don't|this|saw|form|line|me|Indian|who|change|animal|world|took|saw|left|one|paper|people|song|or|start|hear|it|right|keep|state|country|hand|start|it's|river|want|form|point|let|turn|big|hard|give|who|go|quite|keep|mountain|into|were|over|light|take|does|about|high|need|his|three|where|still|away|help|until|if|she|look|end|old|thing|see|watch|those|are|them|group|before|then|own|part|about|oil|more|they|year|walk|carry|us|every|make|under|write|place|down|tree|America|as|came|into|through|again|time|number|of|carry|have|my|miss|them|earth|next|plant|play|once|if|might|while|we|now|soon|last|study|they|idea|us|ask|light|need|later|year|put|made|over|grow|only|come|never|night|year|don't|from|the|learn|turn|so|get|good|something|man|oil|how|use|miss|was|which|no|grow|air|follow|you|our|question|white|end|the|play|change|other|few|watch|high|begin|may|if|as|children|does|old|me|work|to|being|found|story|also|night|water|enough|began|think|earth|on|of|thing|example|when|another|same|white|came|second|also|see|picture|these|hear|answer|list|spell|in|no|this|help|only|of|many|may|question|with|watch|plant|tell|because|along|into|only|what|begin|is|different|people|it's|study|that|these|next|girl|around|night|head|move|between|mountain|oil|why|let|two|enough|night|move|face|know|took|from|to|could|do|first|has|man|once|by|just|two|not|how|face|next|good|but|her|much|left|song|light|book|let|that|still|have|now|follow|school|old|head|which|together|word|have|of|they|put|so|if|too|would|add|they|use|came|me|without|should|second|below|here|stop|important|light|quite|through|animal|children|such|night|must|line|still|now|most|will|plant|were|white|never|no|seem|second|long|country|example|page|give|few|right|don't|first|any|see|small|so|one|go|state|mean|he|go|off|start|their|follow|miss|part|them|in|at|while|quickly|might|start|took|while|far|away|like|thing|get|up|river|line|really|through|answer|made|all|tree|will|mother|each|under|out|have|both|cut|second|think|soon|make|his|right|such|always|way|hard|could|mean|this|year|name|turn|read|make|us|see|go|add|different|keep|through|home|about|when|end|air|now|back|state|he|would|came|into|then|try|live|mother|old|and|song|about|change|life|boy|Indian|own|from|quickly|there|the|long|work|who|all|little|idea|story|before|any|help|boy|for|away|almost|miss|me|at|work|read|question|sea|school|back|are|write|be|run|miss|mile|cut|around|food|side|leave|another|close|know|want|quickly|think|take|turn|leave|thought|at|why|because|no|watch|very|feet|always|eat|eye|close|hand|some|its|country|picture|live|keep|than|really|sea|river|animal|put|time|be|sometimes|river|before|sometimes|world|high|then|that|food|world|sentence|form|grow|use|father|on|the|tell|by|set|from|next|large|open|show|quick|why|also|something|be|saw|well|find|above|so|state|feet|write|thought|why|air|often|watch|thing|any|must|him|day|hand|where|line|sound|its|night|these|down|our|below|the|sometimes|home|really|always|three|hand|thing|school|in|sea|could|if|this|world|important|try|different|school|city|who|car|just|head|each|again|now|add|always|talk|part|sea|side|second|few|people|life|world|as|move|often|water|began|run|play|both|side|said|long|something|take|your|together|last|on|time|them|eat|boy|never|learn|why|letter|form|not|quite|children|come|part|first|are|word|quickly|above|what|know|study|while|girl|spell|above|kind|would|such|come|move|an|tree|or|my|below|tree|under|as|and|does|house|keep|near|miss|read|next|book|like|his|back|quite|picture|without|than|but|we|quickly|plant|into|form|being|while|what|grow|let|will|then|right|which|young|here|keep|very|some|call|little|time|another|men|those|every|put|stop|need|day|have|the|been|his|father|you|like|plant|on|read|these|well|for|close|may|between|book|man|keep|men|while|its|later|than|up|old|begin|found|watch|same|most|big|men|have|been|right|each|different|new|river|begin|are|being|like|change|long|hear|don't|car|make|thought|about|man|animal|under|see|about|hard|also|began|than|when|went|eat|children|question|say|people|are|number|us|day|answer|away|all|follow|life|Indian|but|high|mountain|grow|spell|end|got|look|even|go|some|hard|if|earth|us|only|own|make|hear|how|at|before|idea|here|soon|start|thing|come|did|our|before|mountain|father|they|enough|sometimes|go|had|because|one|oil|us|as|point|came|city|because|tell|see|story|country|all|look|big|name|watch|had|start|tell|no|eye|made|could|do|high|same|think|small|may|run|could|off|head|there|want|home|America|who|question|along|year|close|other|took|list|also|sentence|oil|my|can|three|land|into|kind|more|paper|little|so|talk|mean|went|show|come|cut|plant|kind|live|boy|here|big|page|well|big|word|had|with|eye|through|do|put|girl|got|almost|help|people|America|on|name|only|head|quickly|us|land|house|while|saw|find|help|own|open|off|well|time|tell|ask|such|go|young|stop|often|last|this|four|could|from|make|look|watch|close|my|girl|little|this|where|feet|walk|water|around|did|put|way|eat|family|much|him|here|country|quick|important|has|face|been|read|there|time|still|really|book|have|try|it|spell|list|place|is|try|want|made|could|how|thought|answer|later|every|been|father|far|made|get|start|why|write|how|two|left|no|work|and|want|face|and|picture|animal|run|something|far|quickly|in|important|because|above|be|up|three|example|mile|idea|know|below|long|sound|really|first|letter|name|mean|some|don't|this|saw|form|line|me|Indian|who|change|animal|world|took|saw|left|one|paper|people|song|or|start|hear|it|right|keep|state|country|hand|start|it's|river|want|form|point|let|turn|big|hard|give|who|go|quite|keep|mountain|into|were|over|light|take|does|about|high|need|his|three|where|still|away|help|until|if|she|look|end|old|thing|see|watch|those|are|them|group|before|then|own|part|about|oil|more|they|year|walk|carry|us|every|make|under|write|place|down|tree|America|as|came|into|through|again|time|number|of|carry|have|my|miss|them|earth|next|plant|play|once|if|might|while|we|now|soon|last|study|they|idea|us|ask|light|need|later|year|put|made|over|grow|only|come|never|night|year|don't|from|the|learn|turn|so|get|good|something|man|oil|how|use|miss|was|which|no|grow|air|follow|you|our|question|white|end|the|play|change|other|few|watch|high|begin|may|if|as|children|does|old|me|work|to|being|found|story|also|night|water|enough|began|think|earth|on|of|thing|example|when|another|same|white|came|second|also|see|picture|these|hear|answer|list|spell|in|no|this|help|only|of|many|may|question|with|watch|plant|tell|because|along|into|only|what|begin|is|different|people|it's|study|that|these|next|girl|around|night|head|move|between|mountain|oil|why|let|two|enough|night|move|face|know|took|from|to|could|do|first|has|man|once|by|just|two|not|how|face|next|good|but|her|much|left|song|light|book|let|that|still|have|now|follow|school|old|head|which|together|word|have|of|they|put|so|if|too|would|add|they|use|came|me|without|should|second|below|here|stop|important|light|quite|through|animal|children|such|night|must|line|still|now|most|will|plant|were|white|never|no|seem|second|long|country|example|page|give|few|right|don't|first|any|see|small|so|one|go|state|mean|he|go|off|start|their|follow|miss|part|them|in|at|while|quickly|might|start|took|while|far|away|like|thing|get|up|river|line|really|through|answer|made|all|tree|will|mother|each|under|out|have|both|cut|second|think|soon|make|his|right|such|always|way|hard|could|mean|this|year|name|turn|read|make|us|see|go|add|different|keep|through|home|about|when|end|air|now|back|state|he|would|came|into|then|try|live|mother|old|and|song|about|change|life|boy|Indian|own|from|quickly|there|the|long|work|who|all|little|idea|story|before|any|help|boy|for|away|almost|miss|me|at|work|read|question|sea|school|back|are|write|be|run|miss|mile|cut|around|food|side|leave|another|close|know|want|quickly|think|take|turn|leave|thought|at|why|because|no|watch|very|feet|always|eat|eye|close|hand|some|its|country|picture|live|keep|than|really|sea|river|animal|put|time|be|sometimes|river|before|sometimes|world|high|then|that|food|world|sentence|form|grow|use|father|on|the|tell|by|set|from|next|large|open|show|quick|why|also|something|be|saw|well|find|above|so|state|feet|write|thought|why|air|often|watch|thing|any|must|him|day|hand|where|line|sound|its|night|these|down|our|below|the|sometimes|home|really|always|three|hand|thing|school|in|sea|could|if|this|world|important|try|different|school|city|who|car|just|head|each|again|now|add|always|talk|part|sea|side|second|few|people|life|world|as|move|often|water|began|run|play|both|side|said|long|something|take|your|together|last|on|time|them|eat|boy|never|learn|why|letter|form|not|quite|children|come|part|first|are|word|quickly|above|what|know|study|while|girl|spell|above|kind|would|such|come|move|an|tree|or|my|below|tree|under|as|and|does|house|keep|near|miss|read|next|book|like|his|back|quite|picture|without|than|but|we|quickly|plant|into|form|being|while|what|grow|let|will|then|right|which|young|here|keep|very|some|call|little|time|another|men|those|every|put|stop|need|day|have|the|been|his|father|you|like|plant|on|read|these|well|for|close|may|between|book|man|keep|men|while|its|later|than|up|old|begin|found|watch|same|most|big|men|have|been|right|each|different|new|river|begin|are|being|like|change|long|hear|don't|car|make|thought|about|man|animal|under|see|about|hard|also|began|than|when|went|eat|children|question|say|people|are|number|us|day|answer|away|all|follow|life|Indian|but|high|mountain|grow|spell|end|got|look|even|go|some|hard|if|earth|us|only|own|make|hear|how|at|before|idea|here|soon|start|thing|come|did|our|before|mountain|father|they|enough|sometimes|go|had|because|one|oil|us|as|point|came|city|because|tell|see|story|country|all|look|big|name|watch|had|start|tell|no|eye|made|could|do|high|same|think|small|may|run|could|off|head|there|want|home|America|who|question|along|year|close|other|took|list|also|sentence|oil|my|can|three|land|into|kind|more|paper|little|so|talk|mean|went|show|come|cut|plant|kind|live|boy|here|big|page|well|big|word|had|with|eye|through|do|put|girl|got|almost|help|people|America|on|name|only|head|quickly|us|land|house|while|saw|find|help|own|open|off|well|time|tell|ask|such|go|young|stop|often|last|this|four|could|from|make|look|watch|close|my|girl|little|this|where|feet|walk|water|around|did|put|way|eat|family|much|him|here|country|quick|important|has|face|been|read|there|time|still|really|book|have|try|it|spell|list|place|is|try|want|made|could|how|thought|answer|later|every|been|father|far|made|get|start|why|write|how|two|left|no|work|and|want|face|and|picture|animal|run|something|far|quickly|in|important|because|above|be|up|three|example|mile|idea|know|below|long|sound|really|first|letter|name|mean|some|don't|this|saw|form|line|me|Indian|who|change|animal|world|took|saw|left|one|paper|people|song|or|start|hear|it|right|keep|state|country|hand|start|it's|river|want|form|point|let|turn|big|hard|give|who|go|quite|keep|mountain|into|were|over|light|take|does|about|high|need|his|three|where|still|away|help|until|if|she|look|end|old|thing|see|watch|those|are|them|group|before|then|own|part|about|oil|more|they|year|walk|carry|us|every|make|under|write|place|down|tree|America|as|came|into|through|again|time|number|of|carry|have|my|miss|them|earth|next|plant|play|once|if|might|while|we|now|soon|last|study|they|idea|us|ask|light|need|later|year|put|made|over|grow|only|come|never|night|year|don't|from|the|learn|turn|so|get|good|something|man|oil|how|use|miss|was|which|no|grow|air|follow|you|our|question|white|end|the|play|change|other|few|watch|high|begin|may|if|as|children|does|old|me|work|to|being|found|story|also|night|water|enough|began|think|earth|on|of|thing|example|when|another|same|white|came|second|also|see|picture|these|hear|answer|list|spell|in|no|this|help|only|of|many|may|question|with|watch|plant|tell|because|along|into|only|what|begin|is|different|people|it's|study|that|these|next|girl|around|night|head|move|between|mountain|oil|why|let|two|enough|night|move|face|know|took|from|to|could|do|first|has|man|once|by|just|two|not|how|face|next|good|but|her|much|left|song|light|book|let|that|still|have|now|follow|school|old|head|which|together|word|have|of|they|put|so|if|too|would|add|they|use|came|me|without|should|second|below|here|stop|important|light|quite|through|animal|children|such|night|must|line|still|now|most|will|plant|were|white|never|no|seem|second|long|country|example|page|give|few|right|don't|first|any|see|small|so|one|go|state|mean|he|go|off|start|their|follow|miss|part|them|in|at|while|quickly|might|start|took|while|far|away|like|thing|get|up|river|line|really|through|answer|made|all|tree|will|mother|each|under|out|have|both|cut|second|think|soon|make|his|right|such|always|way|hard|could|mean|this|year|name|turn|read|make|us|see|go|add|different|keep|through|home|about|when|end|air|now|back|state|he|would|came|into|then|try|live|mother|old|and|song|about|change|life|boy|Indian|own|from|quickly|there|the|long|work|who|all|little|idea|story|before|any|help|boy|for|away|almost|miss|me|at|work|read|question|sea|school|back|are|write|be|run|miss|mile|cut|around|food|side|leave|another|close|know|want|quickly|think|take|turn|leave|thought|at|why|because|no|watch|very|feet|always|eat|eye|close|hand|some|its|country|picture|live|keep|than|really|sea|river|animal|put|time|be|sometimes|river|before|sometimes|world|high|then|that|food|world|sentence|form|grow|use|father|on|the|tell|by|set|from|next|large|open|show|quick|why|also|something|be|saw|well|find|above|so");

		word_string = $('#wordlist').text();
		words = word_string.split("|");

		fill_line_switcher();

		//initialisiere wichtige Startwerte die abhängig von der Textgröße ist
		p = $('#row1 span[wordnr="'+word_pointer+'"]').position();

		previous_position_top = 0;

		line_height = parseInt($('#row1 span[wordnr="'+word_pointer+'"]').css('line-height'));

		//springe ins InputField
		$inputfield.val('');
		$inputfield.focus();

		$("#row1").show();
		$("#words").fadeTo('fast', 1.0);

		test_ausgefuehrt++;

		loading = 0;
	}, 250);

}

//wartet auf Eingaben die im #inputfield erfolgen
function activate_keylistener() {

	$inputfield.keydown(selectionCheck); // tracks how many characters are selected

	$inputfield.keyup(function(event) {
		if ( loading == 0 ) {
			start_countdown();
		}

        if (pre_inputvalue === '' && inputvalue === '')
            inputvalue = $inputfield.val();
        else {
            pre_inputvalue = inputvalue;
            inputvalue = $inputfield.val();
        }

        afk_timer = 0;
		$reloadBtn.show();

		$row1_span_wordnr = $('#row1 span[wordnr="'+word_pointer+'"]');

        var keyid = event.which;
        switch (keyid) {
            case 8:
                correction_counter += compare();
                break;
            case 46:
                correction_counter += compare();
                break;
            default:
                break;
        }
        // only check for selected removed if the input value changed
        if (selected && keyid !== 8 && keyid !== 46 && pre_inputvalue !== inputvalue) {
            correction_counter += (compare() + 1);
        }

		if(event.which == input_key_value && $inputfield.val() == ' ')
		{
			$inputfield.val('');
		}
		else if (event.which == input_key_value && loading == 0) { //event.which == 32 => SPACE-Taste

			//evaluate
     		var eingabe = $inputfield.val().split(" ");
     		user_input_stream += eingabe[0]+" ";

			$row1_span_wordnr.removeClass('highlight-wrong');

     		if(eingabe[0] == words[word_pointer])
     		{
     			$row1_span_wordnr.removeClass('highlight').addClass('correct');
     			error_correct++;
     			error_keystrokes += words[word_pointer].length;
     			error_keystrokes++; //für jedes SPACE
     		}
     		else
     		{
     			$row1_span_wordnr.removeClass('highlight').addClass('wrong');
     			error_wrong++;
     			error_keystrokes -= Math.round(words[word_pointer].length / 2);
     		}

     		//process
     		word_pointer++;
     		$row1_span_wordnr = $('#row1 span[wordnr="'+word_pointer+'"]');

			$row1_span_wordnr.addClass('highlight');

     		p = $row1_span_wordnr.position();

     		if(p.top > previous_position_top + 10) //"+ 5 ist die Toleranz, damit der Zeilensprung auch funktioniert, wenn User die Schriftart größer gestellt hat, etc."
     		{
     			row_counter++;
     			previous_position_top = p.top;

     			var zeilensprung_hoehe = (-1 * line_height) * row_counter;
     			$row1.css('top', zeilensprung_hoehe+"px"); //bei einem zeilensprung wird der text um "line_height" verschoben
     			$row1_span_wordnr.addClass('highlight');
     		}

     		//erase
     		$("#inputstream").text(user_input_stream);
     		$inputfield.val(eingabe[1]);
   		} else {
   			//prüfe ob user das wort gerade falsch schreibt (dann zeige es rot an, damit user direkt korrigieren kann)
			//if($inputfield.val().replace(/\s/g, '') == words[word_pointer].substr(0, $inputfield.val().length))
            if($inputfield.val().split(" ")[0] == words[word_pointer].substr(0, $inputfield.val().length))
				$row1_span_wordnr.removeClass('highlight-wrong').addClass('highlight');
			else
				$row1_span_wordnr.removeClass('highlight').addClass('highlight-wrong');
   		}
	});
}

// compares previous value with current, check difference
function compare() {
    return pre_inputvalue.length - inputvalue.length;
}

// count highlighted characters
function selectionCheck(event) {
    selected = event.target.selectionEnd - event.target.selectionStart;
}

//zählt die Zeit runter und stoppt den Speedtest
function start_countdown() {
	if(cd_started == 0)
	{
		cd_started = 1;
		setval = window.setInterval(count_down, 1000);
		start_time = get_current_time();
	}
}

//zählt die Zeit runter
function count_down() {
	countdown--;
    afk_timer++;

	var first_part;
	var second_part;

	first_part = Math.floor(countdown / 60);
	second_part = countdown % 60;

	if(second_part < 10)
		second_part = '0'+second_part;

	$("#timer").text(first_part+":"+second_part);

  	if(countdown > 9)
	{
		$("#timer").text("0:"+countdown);
	} else if(countdown > 0){
		$("#timer").text("0:0"+countdown);
	} else {
		//ENDE => countdown erreicht 0 Sekunden, stoppe den Countdown und Auswertung mittels Ajax
		$("#timer").text("0:00");
		$("#words").fadeOut();

		window.clearInterval(setval);
        setval = "";

		end_time = get_current_time();
		
		$("#auswertung-result #wpm").text(error_correct + error_wrong);
		$("#auswertung-result #correct-words").text(error_correct);
		$("#auswertung-result #wrong-words").text(error_wrong);
		$("#auswertung-result #accuracy").text((error_correct + error_wrong) ? Math.round(100 * error_correct / (error_correct + error_wrong)) : 0);

		$("#auswertung-result").show();
	}
}

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(find, 'g'), replace);
}

function get_current_time() {
	var d = new Date();
	return d.getTime();
}

//String "Trim" Function
function trim11 (str) {
	str = str.replace(/^\s+/, '');
	for (var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}

//befüllt #row1 und #row2 mit neuen Wörtern
function fill_line_switcher() {
	for(i=0; i < words.length; i++)
		row1_string += '<span wordnr="'+i+'" class="">'+words[i]+'</span> '; //classes = NONE, green, red, highlight

	$("#row1").html(row1_string);

	$("#row1 span:first").addClass('highlight');
}

