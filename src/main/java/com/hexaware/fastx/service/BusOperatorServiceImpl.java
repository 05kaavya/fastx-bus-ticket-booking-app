package com.hexaware.fastx.service;

import com.hexaware.fastx.entities.Booking;
import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.entities.Route;
import com.hexaware.fastx.entities.User;
import com.hexaware.fastx.exception.ResourceNotFoundException;
import com.hexaware.fastx.repository.BookingRepository;
import com.hexaware.fastx.repository.BusOperatorRepository;
import com.hexaware.fastx.repository.BusRepository;
import com.hexaware.fastx.repository.RouteRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BusOperatorServiceImpl implements IBusOperatorService {

    @Autowired
    private BusOperatorRepository busOperatorRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public BusOperator addOperator(BusOperator operator) {
        log.info("Adding bus operator: {}", operator.getOperatorName());
        operator.setPassword(passwordEncoder.encode(operator.getPassword())); // encode password
        return busOperatorRepository.save(operator);
    }

    @Override
    public BusOperator getOperatorById(int operatorId) {
        return busOperatorRepository.findById(operatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus operator not found with ID: " + operatorId));
    }

    @Override
    public List<BusOperator> getAllOperators() {
        return busOperatorRepository.findAll();
    }

    @Override
    public String deleteOperatorById(int operatorId) {
        BusOperator operator = getOperatorById(operatorId);
        busOperatorRepository.delete(operator);
        return "Bus Operator deleted successfully";
    }

    @Override
    public List<Bus> getBusesByOperatorId(int operatorId) {
        return busRepository.findByOperatorOperatorId(operatorId);
    }

	/*
	 * @Override public List<Route> getRoutesByOperatorId(int operatorId) { return
	 * busRouteRepository.findByBusOperatorOperatorId(operatorId); }
	 */

    @Override
    public List<Booking> getBookingsByOperatorId(int operatorId) {
        return bookingRepository.findByRouteBusOperatorOperatorId(operatorId);
    }

    @Override
    public List<User> getPassengersByOperatorId(int operatorId) {
        List<Booking> bookings = bookingRepository.findByRouteBusOperatorOperatorId(operatorId);
        return bookings.stream()
                .map(Booking::getUser)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public BusOperator getOperatorByEmail(String email) {
        return busOperatorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Bus operator not found with email: " + email));
    }
    
    @Override
    public Bus addBus(Bus bus) {
        return busRepository.save(bus);
    }

    
    @Override
    public Bus addBusForOperator(Bus bus, int operatorId) {
        BusOperator operator = getOperatorById(operatorId);
        bus.setOperator(operator);
        return busRepository.save(bus);
    }

    @Override
    public Bus updateBusForOperator(Bus bus, int operatorId) {
        Bus existing = busRepository.findById(bus.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + bus.getBusId()));

        if (existing.getOperator().getOperatorId() != operatorId) {
            throw new RuntimeException("You can only update your own buses");
        }

        existing.setBusName(bus.getBusName());
        existing.setBusType(bus.getBusType());
        existing.setTotalSeats(bus.getTotalSeats());

        return busRepository.save(existing);
    }

    @Override
    public String deleteBusForOperator(int busId, int operatorId) {
        Bus existing = busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + busId));

        if (existing.getOperator().getOperatorId() != operatorId) {
            throw new RuntimeException("You can only delete your own buses");
        }

        busRepository.delete(existing);
        return "Bus deleted successfully";
    }
    
    // ----------------------------
    // ✅ Route Management
    // ----------------------------

    @Override
    public List<Route> getRoutesByOperatorId(int operatorId) {
        return routeRepository.findByBusOperatorOperatorId(operatorId);
    }

    @Override
    public Route getRouteById(int routeId) {
        return routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
    }

    @Override
    public Route addRoute(Route route) {
        return routeRepository.save(route);
    }

    @Override
    public Route updateRouteForOperator(Route route, int operatorId) {
        Route existing = routeRepository.findById(route.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        if (existing.getBus().getOperator().getOperatorId() != operatorId) {
            throw new RuntimeException("Not authorized to update this route");
        }

        existing.setOrigin(route.getOrigin());
        existing.setDestination(route.getDestination());
        existing.setDepartureTime(route.getDepartureTime());
        existing.setArrivalTime(route.getArrivalTime());
        existing.setDistance(route.getDistance());
        existing.setFare(route.getFare());

        return routeRepository.save(existing);
    }

    @Override
    public String deleteRouteForOperator(int routeId, int operatorId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        if (route.getBus().getOperator().getOperatorId() != operatorId) {
            throw new RuntimeException("Not authorized to delete this route");
        }

        routeRepository.delete(route);
        return "Route deleted successfully";
    }


    
    @Override
    public Bus getBusById(int busId) {
        return busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with ID: " + busId));
    }


}


/*
 * package com.hexaware.fastx.service;
 * 
 * import java.util.List; import java.util.stream.Collectors;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.security.crypto.password.PasswordEncoder; import
 * org.springframework.stereotype.Service;
 * 
 * import com.hexaware.fastx.entities.Booking; import
 * com.hexaware.fastx.entities.Bus; import
 * com.hexaware.fastx.entities.BusOperator; import
 * com.hexaware.fastx.entities.Route; import com.hexaware.fastx.entities.User;
 * import com.hexaware.fastx.exception.ResourceNotFoundException; import
 * com.hexaware.fastx.repository.BookingRepository; import
 * com.hexaware.fastx.repository.BusOperatorRepository; import
 * com.hexaware.fastx.repository.BusRepository; import
 * com.hexaware.fastx.repository.RouteRepository;
 * 
 * import lombok.extern.slf4j.Slf4j;
 * 
 * @Slf4j
 * 
 * @Service public class BusOperatorServiceImpl implements IBusOperatorService {
 * 
 * @Autowired private BusOperatorRepository busOperatorRepository;
 * 
 * @Autowired private BusRepository busRepository;
 * 
 * @Autowired private RouteRepository busRouteRepository;
 * 
 * @Autowired private BookingRepository bookingRepository;
 * 
 * @Autowired private PasswordEncoder passwordEncoder; // ✅ inject password
 * encoder
 * 
 * 
 * @Override public BusOperator addOperator(BusOperator operator) {
 * log.info("Adding bus operator: {}", operator.getOperatorName());
 * 
 * // ✅ encode password before saving
 * operator.setPassword(passwordEncoder.encode(operator.getPassword()));
 * 
 * return busOperatorRepository.save(operator); }
 * 
 * @Override public BusOperator getOperatorById(int operatorId) {
 * log.info("Fetching bus operator by ID: {}", operatorId); return
 * busOperatorRepository.findById(operatorId) .orElseThrow(() -> new
 * ResourceNotFoundException("Bus operator not found with ID: " + operatorId));
 * }
 * 
 * @Override public List<BusOperator> getAllOperators() {
 * log.info("Fetching all bus operators"); List<BusOperator> operators =
 * busOperatorRepository.findAll(); if (operators.isEmpty()) { throw new
 * ResourceNotFoundException("No bus operators found"); } return operators; }
 * 
 * @Override public String deleteOperatorById(int operatorId) {
 * log.info("Deleting bus operator ID: {}", operatorId); BusOperator operator =
 * busOperatorRepository.findById(operatorId) .orElseThrow(() -> new
 * ResourceNotFoundException("Bus operator not found with ID: " + operatorId));
 * busOperatorRepository.delete(operator); return
 * "Bus Operator deleted successfully"; }
 * 
 * @Override public List<Bus> getBusesByOperatorId(int operatorId) {
 * log.info("Fetching buses for operator ID: {}", operatorId); return
 * busRepository.findByOperatorOperatorId(operatorId); }
 * 
 * @Override public List<Route> getRoutesByOperatorId(int operatorId) {
 * log.info("Fetching routes for operator ID: {}", operatorId); return
 * busRouteRepository.findByBusOperatorOperatorId(operatorId); }
 * 
 * @Override public List<Booking> getBookingsByOperatorId(int operatorId) {
 * log.info("Fetching bookings for operator ID: {}", operatorId); return
 * bookingRepository.findByRouteBusOperatorOperatorId(operatorId); }
 * 
 * @Override public List<User> getPassengersByOperatorId(int operatorId) {
 * log.info("Fetching passengers for operator ID: {}", operatorId);
 * List<Booking> bookings =
 * bookingRepository.findByRouteBusOperatorOperatorId(operatorId); return
 * bookings.stream() .map(Booking::getUser) .distinct()
 * .collect(Collectors.toList()); }
 * 
 * @Override public BusOperator getOperatorByUsername(String operatorName) {
 * log.info("Fetching bus operator by username: {}", operatorName); return
 * busOperatorRepository.findByOperatorName(operatorName) .orElseThrow(() -> new
 * ResourceNotFoundException("Bus operator not found with username: " +
 * operatorName)); } }
 */

