import { useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import { AiOutlineClose } from 'react-icons/ai';
import { RiFileDownloadFill } from 'react-icons/ri';
import { LuDownload } from 'react-icons/lu';

import CardDetails from './cardDetails';

import { formatTime } from '../../../utilities/utilities';

export default function TimeSheet({ employee, closeTimeSheet }) {

    const curDate = new Date()
    const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    const annee = [curDate.getFullYear(), curDate.getFullYear() - 1, curDate.getFullYear() - 2, curDate.getFullYear() - 3, curDate.getFullYear() - 4];
    const today = `${new Date(Date.now()).getFullYear()}-${String(new Date(Date.now()).getMonth() + 1).padStart(2, '0')}-${String(new Date(Date.now()).getDate()).padStart(2, '0')}`;

    // if user click Escape button, it timeSheet hidden authomaticlly
    useEffect(
        () => {
            window.addEventListener('keydown', (e) => { if (e.key == "Escape") { closeTimeSheet(false) } })
        }
    )

    const [selectMonth, setSelectMonth] = useState(curDate.getMonth() + 1);
    const [selectYear, setSelectYear] = useState(curDate.getFullYear());
    const [showData, setShowData] = useState([])
    const [cardDetailsInfo, setCardDetailsInfo] = useState({})
    useEffect(
        () => {
            let totalHours = 0;
            let nbrDaysPresent = 0;
            let nbrDaysAbsent = 0;
            let nbrLate = 0;
            let conge = 0; // for know how much days this employee takes as vacation
            let monthlySalary = 0;
            let unitSalary = employee.employee.salaryHour + employee.employee.position.salaryHour
            let calcWeeklyHour = 0;
            let drissi = [];
            let calcVacationDays = true;
            // let today = `${new Date(Date.now()).getFullYear()}-${String(new Date(Date.now()).getMonth() + 1).padStart(2, '0')}-${String(new Date(Date.now()).getDate()).padStart(2, '0')}`;

            const numDays = new Date(+selectYear, +selectMonth, 0).getDate();


            for (let i = 1; i <= numDays; i++) {
                const info = { date: `${selectYear}-${String(selectMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}` };
                info['dayName'] = new Date(`${selectYear}-${selectMonth}-${i}`).toLocaleDateString('fr-FR', { weekday: 'long' });
                info['dailyHour'] = null;
                const calcDailyHour = [];

                if(info['dayName'] != 'dimanche' ){
                    const alowScanDate = (new Date().getTime() - new Date(info['date']).getTime()) >= 0;
                    employee.employee.scans.forEach((scan) => {
                        // alowScanDate does filter of days 
                        if (scan.state == 'vacation' && calcVacationDays) {
                            conge++;
                        }

                        if (scan.created_at.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0] == info['date'] && alowScanDate) {
                            if (scan.state == "arrivalTime") {
                                nbrDaysPresent++;
                                info["arrivalTime"] = scan.created_at.match(/[0-9]{1,4}:[0-9]{1,2}/g)[0]
                                calcDailyHour.push(new Date(`${today} ${info["arrivalTime"]}`).getTime());

                                if (scan.enRetard == true) {
                                    info['state'] = 'Retard';
                                    nbrLate++;
                                } else {
                                    info['state'] = 'Present';
                                }

                            } else if (scan.state == "beforeBreak") {
                                info["beforeBreak"] = scan.created_at.match(/[0-9]{1,4}:[0-9]{1,2}/g)[0]
                                calcDailyHour.push(new Date(`${today} ${info["beforeBreak"]}`).getTime())

                            } else if (scan.state == "afterBreak") {
                                info["afterBreak"] = scan.created_at.match(/[0-9]{1,4}:[0-9]{1,2}/g)[0]
                                calcDailyHour.push(new Date(`${today} ${info["afterBreak"]}`).getTime())

                            } else if (scan.state == "departureTime") {
                                info["departureTime"] = scan.created_at.match(/[0-9]{1,4}:[0-9]{1,2}/g)[0]
                                calcDailyHour.push(new Date(`${today} ${info["departureTime"]}`).getTime())
                            } else if (scan.state == "holidays") {
                                info['state'] = "jour ferie";
                            } else if (scan.state == 'vacation') {
                                info['state'] == 'conge';
                            } else if (scan.state == "sick"){
                                info['state'] == 'malade'
                            }
                        } else if (scan.state == 'holidays' && info['state'] == undefined && scan.created_at.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0] == info['date']) {
                            info['state'] = 'jour ferie';

                        } else if (scan.created_at.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0] == info['date'] && scan.state == 'vacation') {
                            info["state"] = "conge";
                        } else if (scan.created_at.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0] == info['date'] && scan.state == 'sick') {
                            info["state"] = "malade"
                        }


                    })
                    calcVacationDays = false; // for disactivate calculates number of vacation days

                    if (info['state'] == undefined) {
                        if (alowScanDate) {
                            info['state'] = 'Absent';
                            nbrDaysAbsent++;
                        } else {
                            info['state'] = 'no Scan'
                        }
                    }

                    // this part for calculate to any employee how much hour work in day
                    calcDailyHour.sort((a, b) => a - b)
                    if (calcDailyHour.length == 1) {
                        const t = new Date().getTime() - calcDailyHour[0];
                        info['dailyHour'] = (t<0 || t>1000*60*60*8)?1000*60*60*8:t;
                        calcWeeklyHour += info['dailyHour'];

                    } else if (calcDailyHour.length == 2) {
                        info['dailyHour'] = calcDailyHour[1] - calcDailyHour[0];
                        calcWeeklyHour += info['dailyHour'];

                    } else if (calcDailyHour.length == 3) {
                        const t = calcDailyHour[1] - calcDailyHour[0] + new Date().getTime() - calcDailyHour[2];
                        info['dailyHour'] = (t<0 || t>1000*60*60*8)?1000*60*60*8:t;
                        calcWeeklyHour += info['dailyHour'];

                    } else if (calcDailyHour.length == 4) {
                        info['dailyHour'] = calcDailyHour[1] - calcDailyHour[0] + calcDailyHour[3] - calcDailyHour[2];
                        calcWeeklyHour += info['dailyHour'];
                    } else if (info['state'] == 'holiday' || info["state"] == 'conge' || info["state"] == "jour ferie" || info["state"] == "malade") {
                        info['dailyHour'] = 8 * 60 * 60 * 1000;
                        if(info['dayName'] == "samedi"){
                            info['dailyHour'] = 4 * 60 * 60 * 1000;
                        }
                        calcWeeklyHour += info['dailyHour'];

                    } else {
                        info['dailyHour'] = 0;
                    }

                    // about totalHours variable is total to all daily hour
                    totalHours += info['dailyHour'];
                    info['dailyHour'] = formatTime(+info['dailyHour']);
                    if(info['dayName'] != 'dimanche'){
                        drissi.push(info);
                    }
                }

                if (info['dayName'] == 'dimanche' || i == numDays) {
                    const python = {};
                    python['date'] = 'total horaire par semaine';
                    python['dayName'] = "";
                    python['arrivalTime'] = " ";
                    python['beforeBreak'] = " ";
                    python['afterBreak'] = " ";
                    python['departureTime'] = " ";
                    python['dailyHour'] = formatTime(calcWeeklyHour);
                    drissi.push(python);
                    calcWeeklyHour = 0;
                }
            }

            monthlySalary = (unitSalary * totalHours / (1000 * 60 * 60)).toFixed(2)


            setShowData(drissi);

            setCardDetailsInfo({
                nbrLate: nbrLate,
                nbrDaysAbsent: nbrDaysAbsent,
                nbrDaysPresent: nbrDaysPresent,
                totalHours: totalHours,
                monthlySalary: monthlySalary,
                conge: conge / 4
            });

        }, [selectMonth, selectYear]
    )

    const downloadTimeSheet = () => {
        const summaryData = [{
            "numbre des jours present": cardDetailsInfo['nbrDaysPresent'],
            "numbre des jours absent": cardDetailsInfo['nbrDaysAbsent'],
            "numbre des retard": cardDetailsInfo['nbrLate'],
            "total des hours travaill": formatTime(cardDetailsInfo['totalHours']),
            "le salaire mensuel (DH)": cardDetailsInfo['monthlySalary'],
        }]
        const worksheet = XLSX.utils.json_to_sheet(showData);
        XLSX.utils.sheet_add_json(worksheet, [{}, {}], { skipHeader: false, origin: -1 });

        XLSX.utils.sheet_add_json(worksheet, summaryData, { skipHeader: false, origin: -1 });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `${employee.name}`)
        XLSX.writeFile(workbook, `${employee.name} ${today}.xlsx`)
    }


    return <div className='timeSheet'>
        <div className='closeBtn'>
            <button onClick={() => closeTimeSheet(false)}>
                <AiOutlineClose />
            </button>
        </div>

        <div className='dateAndDownload'>
            <div className='date'>
                <p>Mois: </p>
                <div>
                    <select name="" id="" onChange={(e) => setSelectMonth(e.target.value)}>
                        {
                            mois.map((item, index) => <option key={index} value={index + 1} selected={index == curDate.getMonth() || false} >{item}</option>)
                        }

                    </select>
                </div>
                <p>Annee: </p>
                <div>
                    <select name="" id="" onChange={(e) => setSelectYear(e.target.value)}>
                        {
                            annee.map((item, index) => <option key={index} value={item} selected={index == curDate.getFullYear()} >{item}</option>)
                        }
                    </select>
                </div>
            </div>

            <div className='download'>
                <button onClick={() => downloadTimeSheet()}>
                    <LuDownload />
                    Exporter vers Excel
                </button>
            </div>
        </div>

        <div className='cardDetails'>
            <CardDetails title='Total des Heures Travaillées' value={`${formatTime(cardDetailsInfo['totalHours'])}`} />
            <CardDetails title='Jours Présents' value={`${cardDetailsInfo['nbrDaysPresent']}`} />
            <CardDetails title='Jours Absents' value={`${cardDetailsInfo['nbrDaysAbsent']}`} />
            <CardDetails title='Retards Totaux' value={`${cardDetailsInfo['nbrLate']}`} />
            <CardDetails title='Salaire Mensuel' value={`${cardDetailsInfo['monthlySalary']} DH`} />
            <CardDetails title='Nombre de jours de congé par an' value={`${cardDetailsInfo['conge']}`} />
        </div>

        <div className='tableDetails'>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Jour</th>
                        <th>Heure d'Arrivée</th>
                        <th>Heure Avant Pause</th>
                        <th>Heure Après Pause</th>
                        <th>Heure de Départ</th>
                        <th>Heures Travaillées</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        showData?.map((item, index) => {
                            return (
                                <tr key={index} >
                                    <td>{item.date}</td>
                                    <td>{item.dayName}</td>
                                    <td>{item.arrivalTime || '-'}</td>
                                    <td>{item.beforeBreak || '-'}</td>
                                    <td>{item.afterBreak || '-'}</td>
                                    <td>{item.departureTime || '-'}</td>
                                    <td>{item.dailyHour || '0h'}</td>
                                    <td className={`state ${item.state}`}>{item.state}</td>

                                </tr>)
                        })
                    }

                </tbody>
            </table>
        </div>
    </div>
}