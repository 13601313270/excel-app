/**
 * Created by ptmind on 2018/3/30.
 */
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
import funcLanguageParser from '../languageParser/functionCall';
import ajax from '../api/ajax';
import FuncObj from './FuncObj';

class relationalModel extends FuncObj {
    constructor(source, table, x, y, where) {
        super(...Array.from(arguments));
        this.props = Array.from(arguments);
        this.name = 'RELATIONAL_MODEL';
        this.groupColumn = [];
        this.dataColumn = [];
        this.dataValue = [];
        this.dep.update();
    }

    get value() {
        return this.dataValue;
    }

    render(handle) {
        console.log(9999);
        handle(new Promise((resolve, reject) => {
            console.log(this.props);
            let source = this.props[0] instanceof Obj ? this.props[0].value : this.props[0];
            let table = this.props[1] instanceof Obj ? this.props[1].value : this.props[1];
            let x = this.props[2] instanceof Obj ? this.props[2].value : this.props[2];
            let y = this.props[3] instanceof Obj ? this.props[3].value : this.props[3];
            ajax({
                type: 'POST',
                url: 'http://www.tablehub.cn/action/mysql.html',
                data: {
                    type: 'run',
                    connection: parseInt(source),
                    table: table,
                    sql: {
                        select: y.concat(x),
                        groupBy: x
                    }
                }
            }).then((data) => {
                this.groupColumn = [];
                this.dataColumn = [];
                this.dataValue = [];
                if(data === false) {
                    resolve();
                } else {
                    let x = this.props[2];
                    if(x instanceof Obj) {
                        x = x.value;
                    }
                    let y = this.props[3].value;
                    this.groupColumn.push(x);
                    this.dataColumn.push(...y);
                    data.forEach((item) => {
                        let insert = [item[x]];
                        y.forEach((eachY) => {
                            insert.push(item[eachY]);
                        });
                        this.dataValue.push(insert);
                    });
                    resolve();
                }
            });
        }));
    }
}
__allMatch__.push({
    match: /^RELATIONAL_MODEL/,
    type: 'function',
    name: 'RELATIONAL_MODEL',
    title: '关系模型',
    func: relationalModel,
    value: funcLanguageParser,
    props: [
        {
            name: 'source',
            title: '关系模型',
            dataType: 'number',
            default: ''
        },
        {
            name: 'table',
            title: '表',
            dataType: 'string',
            default: ''
        },
        {
            name: 'x',
            title: 'X轴',
            dataType: 'string,var',
            default: ''
        },
        {
            name: 'y',
            title: 'Y轴',
            dataType: 'array(string)',
            default: ''
        },
        {
            name: 'where',
            title: '条件',
            dataType: 'array(string)'
        }
    ],
    returnType: 'relationalModel'
});
export default relationalModel;
