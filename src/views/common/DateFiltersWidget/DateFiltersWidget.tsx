export const DateFiltersWidget = () => null;

// export const DateFiltersWidget = ({onDatesChange, dates}: Props) => {
//     const onFromChange = (e: ChangeEvent<HTMLInputElement>) => {
//         onDateInfoChange(DateFiltersWidgetTab.CUSTOM, e.target.value, dates.toDateLocal);
//     };
//
//     const onToChange = (e: ChangeEvent<HTMLInputElement>) => {
//         onDateInfoChange(DateFiltersWidgetTab.CUSTOM, dates.fromDateLocal, e.target.value);
//     };
//
//     return (
//         <div>
//             {tab === DateFiltersWidgetTab.CUSTOM && (
//                 <form className={classes.datesContainer} noValidate>
//                     <TextField
//                         label="From"
//                         type="date"
//                         value={dates.fromDateLocal}
//                         className={classes.textField}
//                         InputLabelProps={{shrink: true}}
//                         onChange={onFromChange}
//                     />
//                     <TextField
//                         label="To"
//                         type="date"
//                         value={dates.toDateLocal}
//                         className={classes.textField}
//                         InputLabelProps={{shrink: true}}
//                         onChange={onToChange}
//                     />
//                 </form>
//             )}
//         </div>
//     );
// };
