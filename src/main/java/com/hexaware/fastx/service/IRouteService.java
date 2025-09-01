package com.hexaware.fastx.service;

import java.util.List;

import com.hexaware.fastx.entities.Route;

public interface IRouteService {
	
	public Route addRoute(Route route);
	public Route getRouteById(int routeId);
    public List<Route> getAllRoutes();
    public String deleteRoute(int routeId);

}

