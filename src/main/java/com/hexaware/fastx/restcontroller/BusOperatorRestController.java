package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BusOperatorDto;
import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.service.IBusOperatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bus-operators")
public class BusOperatorRestController {

    @Autowired
    private IBusOperatorService service;

    @PostMapping("/add")
    public BusOperator addOperator(@RequestBody BusOperatorDto dto) {
        BusOperator operator = dto.toEntity();
        return service.addOperator(operator);
    }

    @GetMapping("/get/{operatorId}")
    public BusOperator getOperatorById(@PathVariable int operatorId) {
        return service.getOperatorById(operatorId);
    }

    @GetMapping("/getall")
    public List<BusOperator> getAllOperators() {
        return service.getAllOperators();
    }

    @DeleteMapping("/delete/{operatorId}")
    public String deleteOperator(@PathVariable int operatorId) {
        return service.deleteOperatorById(operatorId);
    }
}

