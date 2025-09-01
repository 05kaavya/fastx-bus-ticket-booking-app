package com.hexaware.fastx.restcontroller;

import com.hexaware.fastx.dto.BusOperatorDto;
import com.hexaware.fastx.entities.BusOperator;
import com.hexaware.fastx.service.IBusOperatorService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/bus-operators")
public class BusOperatorRestController {

    @Autowired
    private IBusOperatorService service;

    @PostMapping("/add")
    public BusOperator addOperator(@RequestBody BusOperatorDto dto) {
    	  log.info("Adding bus operator: {}", dto.getOperatorName());
          return service.addOperator(dto.toEntity());
      }

    @GetMapping("/get/{operatorId}")
    public BusOperator getOperatorById(@PathVariable int operatorId) {
    	 log.info("Fetching bus operator ID: {}", operatorId);
        return service.getOperatorById(operatorId);
    }

    @GetMapping("/getall")
    public List<BusOperator> getAllOperators() {
    	 log.info("Fetching all bus operators");
        return service.getAllOperators();
    }

    @DeleteMapping("/delete/{operatorId}")
    public String deleteOperator(@PathVariable int operatorId) {
    	 log.info("Deleting bus operator ID: {}", operatorId);
        return service.deleteOperatorById(operatorId);
    }
}

