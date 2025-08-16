let BOOKINGS=[];
export function addBooking(b){const id=Date.now().toString();BOOKINGS.push({id,...b});return {ok:true,id};}
export function listBookings(){return BOOKINGS.sort((a,b)=>b.id.localeCompare(a.id));}
