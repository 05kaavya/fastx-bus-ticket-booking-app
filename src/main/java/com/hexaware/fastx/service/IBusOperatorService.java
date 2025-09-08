package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.entities.User;

public interface IBusOperatorService {
	
    BusOperator addOperator(BusOperator operator);
    BusOperator getOperatorById(int operatorId);
    List<BusOperator> getAllOperators();
    String deleteOperatorById(int operatorId);

    List<Bus> getBusesByOperatorId(int operatorId);
    List<Route> getRoutesByOperatorId(int operatorId);
    List<Booking> getBookingsByOperatorId(int operatorId);
    List<User> getPassengersByOperatorId(int operatorId);

    BusOperator getOperatorByEmail(String email);

    Bus addBus(Bus bus);
    Bus addBusForOperator(Bus bus, int operatorId);
    Bus updateBusForOperator(Bus bus, int operatorId);
    String deleteBusForOperator(int busId, int operatorId);

    Route getRouteById(int routeId);
    Route addRoute(Route route);
    Route updateRouteForOperator(Route route, int operatorId);
    String deleteRouteForOperator(int routeId, int operatorId);
	Bus getBusById(int busId);
}
