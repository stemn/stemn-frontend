(function () {
    window.GerberParser = {};
	GerberParser.parse = parse;

    ///////////////////////////////////////////////

    function parse(text){
        if(text.match(/^[\s%]*M48/))
            return wG.loadDrill(text);

        text = text.replace(/\s+/g, ''); // Get rid of any spaces/newlines.
        //text = text.replace(/%%+/g, ''); // Compact parameters.

        // Split into data and parameters sections;
        var sections = text.split('%');

        var g = {offA: 0, offB: 0, shapes: [], cmds: [], scale: 1}, shape = 0, macros = {}, mode = 1, inverted = false, prevX = 0, prevY = 0;

        function numVal(x) {
            if(x[0] == '+')
                return numVal(x.slice(1));
            if(x[0] == '-')
                return -numVal(x.slice(1));
            if(x == '0')
                return 0;
            if(g.omitLead)
                while(x.length < g.num)
                    x = '0'+x;
            else
                while(x.length < g.num)
                    x += '0';
            return parseFloat(x.slice(0, g.int)+'.'+x.slice(g.int), 10);
        }

        // Even positions are function codes, odd ones are parameters.
        for(var i = 0; i < sections.length; i++) {
            // Ignore empty sections.
            if(!sections[i].length)
                continue;
            // Get rid of data end markers at the end of data.
            sections[i][sections[i].length-1] == '*' && (sections[i] = sections[i].slice(0, -1));
            sections[i] = sections[i].split('*');
            for(var j = 0; j < sections[i].length; j++) {
                var d = sections[i][j];
                if(i%2) { // Parameters.
                    if(d[0] == 'F' && d[1] == 'S') {// Format Specification.
                        var r = /^([LT]?)([AI])X(\d)(\d)Y(\d)(\d)$/.exec(d.slice(2)); // assert(r);
                        g.omitLead = !r[1] || r[1] == 'L';
                        g.abs = r[2] == 'A';
                        if(!g.abs) throw new Error('Need absolute values');
                        g.int = +r[3], g.dec = +r[4], g.num = g.int+g.dec;
                    } else if(d[0] == 'O' && d[1] == 'F') {// Offset.
                        var r = /^(?:A([-+\d.]+)|)(?:B([-+\d.]+)|)$/.exec(d.slice(2)); // assert(r);
                        g.offA = parseInt(r[1], 10), g.offB = parseInt(r[2], 10);
                    } else if(d == 'IPNEG') // Image Polarity.
                        throw new Error('Negative image polarity');
                    else if(d[0] == 'L' && d[1] == 'P') { // Layer Polarity.
                        if(inverted && d[2] == 'D') // Switch to dark.
                            g.cmds.push([16<<2, inverted = false]);
                        else if(!inverted && d[2] == 'C') // Switch to clear.
                            g.cmds.push([16<<2, inverted = true]);
                    } else if(d[0] == 'A' && d[1] == 'M') { // Aperture Macro.
                        var macro = [];
                        for(j++; j < sections[i].length; j++)
                            macro.push(sections[i][j]/*.split(',')*/);
                        macros[d.slice(2)] = macro;
                    } else if(d[0] == 'A' && d[1] == 'D' && d[2] == 'D') { // Aperture Definition.
                        var r = /^(\d+)([^,]+)(?:,(.+)|)$/.exec(d.slice(3)); // assert(r);
                        var j = r[1]-10, args = [];
                        if(r[3])
                            args = r[3].split('X');
                        if(macros[r[2]]) {
                            function applyArgs(m) {
                                m = m.replace(/\$(\d+)/g, function(s, n) {
                                    return +args[n-1] || 0;
                                }).toLowerCase(), repl = true;
                                while(repl == true)
                                    repl = false, m = m.replace(/([\d.]+)x([\d.]+)/g, function(s, a, b) {return repl = true, a*b});
                                repl = true;
                                while(repl == true)
                                    repl = false, m = m.replace(/([\d.]+)\/([\d.]+)/g, function(s, a, b) {return repl = true, a/b});
                                repl = true;
                                while(repl == true)
                                    repl = false, m = m.replace(/([\d.]+)\+([\d.]+)/g, function(s, a, b) {return repl = true, a+b});
                                repl = true;
                                while(repl == true)
                                    repl = false, m = m.replace(/([\d.]+)-([\d.]+)/g, function(s, a, b) {return repl = true, a-b});
                                return m;
                            }
                            var m1 = macros[r[2]], m2 = [];
                            for(var k = 0; k < m1.length; k++) {
                                var eq = /^\$(\d+)=(.+)$/.exec(m1[k]);
                                if(eq)
                                    args[eq[1]-1] = +applyArgs(eq[2]);
                                else
                                    m2.push(applyArgs(m1[k]).split(',').map(function(x) {return +x}));
                            }
                            g.shapes[j] = ['M', m2];

                        } else
                            g.shapes[j] = [r[2]].concat(args.map(function(x) {return +x}));
                        if(j < shape)
                            shape = j;
                    } else if(d == 'MOIN') // Specify Inches.
                        g.scale = 25.4;
                    else if(d == 'MOMM') // Specify MMs.
                        g.scale = 1;
                    else{
                        // console.log(d);
                    }
                } else { // Function codes.
                    if(d[0] == 'G' && d[1] == '0' && d[2] == '4' || d[0] == 'M')
                        continue;
                    if(d[0] == 'G' && d[1] == '5' && d[2] == '4')
                        d = d.slice(3);
                    if(d == 'G70') { // Specify Inches.
                        g.scale = 25.4;
                        continue;
                    }
                    if(d == 'G74') { // Set Single quadrant mode.
                        mode &= ~4;
                        continue;
                    }
                    if(d == 'G75') { // Set Multi quadrant mode.
                        mode |= 4;
                        continue;
                    }
                    if(d == 'G36') { // Start Outline fill.
                        if(!(mode & 8))
                            g.cmds.push([8<<2, true]);
                        mode |= 8;
                        continue;
                    }
                    if(d == 'G37') { // End Outline fill.
                        if(mode & 8)
                            g.cmds.push([8<<2, false]);
                        mode &= ~8;
                        continue;
                    }
                    var cmode = 0;
                    if(d[0] == 'G' && d.length > 4) {
                        var r = /^\d*/.exec(d = d.slice(1)); // assert(r);
                        mode = (mode & 12) | (cmode = parseInt(r[0], 10));
                        d = d.slice(r[0].length);
                    }
                    function getNum(offset) {
                        var r = /^[-+\d]*/.exec(d = d.slice(offset)); // assert(r);
                        d = d.slice(r[0].length);
                        return numVal(r[0]);
                    }
                    var x = prevX, y = prevY, oi = 0, oj = 0, hasX = false, hasY = false;
                    if(d[0] == 'X')
                        x = getNum(1), hasX = true;
                    if(d[0] == 'Y')
                        y = getNum(1), hasY = true;
                    if(d[0] == 'I')
                        oi = getNum(1), (!(mode&2) && (x += oi, hasX = true));
                    if(d[0] == 'J')
                        oj = getNum(1), (!(mode&2) && (y += oj, hasY = true));
                    if(d[0] == 'D')  {// Draw.
                        if(d[1] == '0')
                            g.cmds.push([(mode<<2) | d[2], shape, x, y, oi, oj]);
                        else
                            shape = d.slice(1)-10;
                    } else if(hasX && (x != prevX) || hasY && (y != prevY))
                        g.cmds.push([(mode<<2) | 1, shape, x, y, oi, oj]);
                    else
                    prevX = x, prevY = y;
                }
            }
        }
        return g;
    }
})();
