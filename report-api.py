import sys,os,json
from flask import Flask, request
from flask import jsonify
app = Flask(__name__)

def parse_report(f):
    d = {}
    with open(f) as fin:
        for line in fin:
            t = line.strip().split()
            if len(t) < 4: continue
            k = ' '.join(t[:-2])
            v1 = t[-2]
            v2 = t[-1].split('(')[0]
            d[k] = [s2n(v1),s2n(v2)]
    return d

def s2n(s):
    '''safely convert string to numbers, return int, float if float or percetage'''
    if '%' in s:
        return float(s.strip('%'))/100.0
    elif '.' in s:
        return float(s)
    else:
        return int(s)

def main(flist):
    d = {}
    flis = flist.split(',')
    #flis.sort()
    for f in flis:
        k = os.path.basename(f)
        d[k] = parse_report(f)
    #print d
    kf = [os.path.basename(x) for x in flis]
    #mapping
    header = ['Total reads','Mapped reads','Non-redundant uniquely mapped reads','Useful reads']
    header2 = ['Percentage of uniquely mapped reads in chrM','Percentage of reads in chrX','Percentage of reads in chrX']
    header3 = ['Before alignment library duplicates percentage','After alignment PCR duplicates percentage']
    header4 = ['Useful reads ratio','Percentage of background RPKM smaller than 0.3777']
    header5 = ['Number of peaks','Reads under peaks ratio']
    outheader = {
        'mapping':header,
        'chrM rate':header2,
        'library complexity': header3,
        'enrichment':header4,
        'peaks':header5
    }
    results = {}
    # the results stucture was optimized for raw d3 usage
    # the results stucture was optimized for react-d3-components usage
    # the results stucture was optimized for recharts usage
    for oh in outheader:
        results[oh] = []
        for idxk,k in enumerate(kf):
            td = {}
            sampleName = k.split('_')[0]
            td['name'] = sampleName
            for h in outheader[oh]:    
                td[h] = d[k][h][0]
            results[oh].append(td)
            if idxk == len(kf) - 1:
                td1 = {}
                td1['name'] = 'ENCODE'
                for h in outheader[oh]:
                    td1[h] = d[k][h][1]
                results[oh].append(td1)            
    return results

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/report/<flist>')
def report(flist):
    return jsonify(main(flist))

@app.route('/rep', methods=['POST'])
def rep():
    fd = request.json
    return jsonify(main(','.join(fd['flist'])))

if __name__ == "__main__":
    main()
