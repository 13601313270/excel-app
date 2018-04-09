/**
 * Created by ptmind on 2018/3/30.
 */
import Obj from '../observer/obj';
import __allMatch__ from '../languageParser/allMatch';
import funcLanguageParser from '../languageParser/functionCall';
import createCodeText from '../languageParser/getStrByObj';
import ajax from '../api/ajax';

class relationalModel extends Obj {
    constructor() {
        super();
        this.props = Array.from(arguments);
        this.name = 'RELATIONAL_MODEL';
        this.type = 'relationalModel';
        this.groupColumn = [];
        this.dataColumn = [];
        this.dataValue = [];
        this.dep.update();
    }

    get value() {
        return this.dataValue;
    }

    render(handle) {
        handle(new Promise((resolve, reject) => {
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
                if (data === false) {
                    resolve();
                } else {
                    let x = this.props[2];
                    if (x instanceof Obj) {
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

    getCodeByObj() {
        let code = 'RELATIONAL_MODEL(';
        let TempPropArr = [];
        this.props.forEach((item) => {
            TempPropArr.push(createCodeText(item));
        });
        code += TempPropArr.join(',');
        code += ')';
        return code;
    }
}
__allMatch__.push({
    match: /^RELATIONAL_MODEL/,
    type: 'relationalModel',
    name: 'RELATIONAL_MODEL',
    title: '关系模型',
    func: relationalModel,
    value: funcLanguageParser,
    props: [
        {
            name: 'source:',
            title: '关系模型',
            dataType: 'number',
            default: ''
        },
        {
            name: 'table:',
            title: '表',
            dataType: 'string',
            default: ''
        },
        {
            name: 'x:',
            title: 'X轴',
            dataType: 'string,var',
            default: ''
        },
        {
            name: 'y:',
            title: 'Y轴',
            dataType: 'array(string)',
            default: ''
        }
    ]
});
export default relationalModel;
