package com.hexaware.fastx.servicetest;

import com.hexaware.fastx.entities.Bus;
import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.service.IBusService;
import com.hexaware.fastx.service.IBusOperatorService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class BusServiceImplTest {

    @Autowired
    private IBusService busService;

    @Autowired
    private IBusOperatorService busOperatorService;

    static int createdBusId;
    static int createdOperatorId;

    @BeforeAll
    static void setupOperator(@Autowired IBusOperatorService busOperatorService) {
        BusOperator operator = new BusOperator();
        operator.setOperatorName("Test Operator");
        operator.setEmail("operator" + System.currentTimeMillis() + "@mail.com");
        operator.setPassword("Test@123");
        operator.setContactNumber("9876543210");
        operator.setAddress("Operator Address");

        BusOperator savedOperator = busOperatorService.addOperator(operator);
        createdOperatorId = savedOperator.getOperatorId();
    }

    @Test
    @Order(1)
    void testAddBus() {
        Bus bus = new Bus();
        bus.setBusName("Test Bus");
        bus.setBusNumber("TN09AB1234");
        bus.setBusType("AC Sleeper");
        bus.setTotalSeats(40);
        bus.setAmenities("WiFi, Charging Point");

        BusOperator operator = busOperatorService.getOperatorById(createdOperatorId);
        bus.setOperator(operator);

        Bus savedBus = busService.addBus(bus);
        assertNotNull(savedBus);
        createdBusId = savedBus.getBusId();
        assertEquals("Test Bus", savedBus.getBusName());
    }

    @Test
    @Order(2)
    void testGetBusById() {
        Bus fetched = busService.getBusById(createdBusId);
        assertNotNull(fetched);
        assertEquals(createdBusId, fetched.getBusId());
    }

    @Test
    @Order(3)
    void testFindByName() {
        Bus fetched = busService.findByName("Test Bus");
        assertNotNull(fetched);
        assertEquals("Test Bus", fetched.getBusName());
    }

    @Test
    @Order(4)
    void testUpdateBus() {
        Bus existing = busService.getBusById(createdBusId);
        existing.setAmenities("Updated WiFi, Charging, TV");

        Bus updated = busService.updateBus(existing);
        assertNotNull(updated);
        assertTrue(updated.getAmenities().contains("Updated"));
    }

    @Test
    @Order(5)
    void testGetAllBuses() {
        List<Bus> buses = busService.getAllBuses();
        assertTrue(buses.size() > 0);
    }

    @Test
    @Order(6)
    void testDeleteBus() {
        String result = busService.deleteBus(createdBusId);
        assertTrue(result.contains("deleted"));
    }
}
