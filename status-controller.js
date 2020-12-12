export default app => {

    require('./directives')(app);

    app.controller('OrderStatusController', function(
        $scope,
        $state,
        ApiService,
        Upload
    ) {

        $scope.history = {};
        $scope.new_customer_manager_id = null;
        $scope.new_sales_rep_id = null;
        $scope.loading = false;
        $scope.cert_loading = false;

        const formatDate = (cat, field) => {
            if ($scope.status[cat] &&
                $scope.status[cat][field] &&
                $scope.status[cat][field].data) {
                $scope.status[cat][field].data = new Date($scope.status[cat][field].data);
            }
        };

        const refreshStatus = () => {

            //const x=$scope.status['approval']['senior_designer_verfied_date'].data;

            $scope.post('status', {
                order_id: $scope.order.id,
            }).then(
                (r) => {
                    $scope.status = r.data;
                    formatDate('delivery', 'delivery_date_set');
                    formatDate('delivery', 'warranty_date');
                    formatDate('delivery', 'pickup_date');

                    $scope.status['approval']['deposit_paid'].data = parseFloat($scope.status['approval']['deposit_paid'].data);

                    $scope.loading = false;
                }
            );




            $scope.post('status-history', {
                order_id: $scope.order.id,
            }).then(
                (r) => {
                    $scope.status_history = r.data.history;
                }
            );

            
        };

        const refreshCerts = () => {
            
            // console.log('status - docs');
            
            $scope.loading = false;

            $scope.post('status-docs', {
                order_id: $scope.order.id,
            }).then(
                (r) => {
                    $scope.status_docs = r.data.docs_data;
                    // console.log($scope.status_docs);
                }
            );
        };
        
        refreshStatus();

        refreshCerts();

        $scope.sectionComplete = (section) => {
            if (section) {
                for (let k of Object.keys(section)) {
                    if (section[k].status !== 'Complete' && section[k].status !== 'Optional') {
                        return false;
                    }
                }
                return true;
            }
        };

        const statusUpdate = (data) => {
            if ($scope.loading) {
                return;
            }

            $scope.loading = true;
            data.order_id = $scope.order.id;
            return ApiService.post('orders/status-update', data).finally(() => {
                refreshStatus();
                refreshCerts();
            });
        };

        const checkValidAndUpdate = (form, field_name, field_value) => {
            if (form.$valid) {
                let data = {};
                data[field_name] = field_value;
                statusUpdate(data);
            }
        };

        const statusDelete = (data) => {
            if ($scope.loading) {
                return;
            }

            $scope.loading = true;
            data.order_id = $scope.order.id;
            return ApiService.post('orders/status-delete', data).finally(() => {
                refreshStatus();
            });
        };

        const checkValidAndDelete = (form, field_name, field_value) => {
            if (form.$valid) {
                let data = {};
                data[field_name] = field_value;
                statusDelete(data);
            }
        };

        $scope.updateDeposit = (form, deposit) => {
            checkValidAndUpdate(form, 'deposit', deposit);
        };

        $scope.updateChassis = () => {
            statusUpdate({ 'chassis_number': true });
        };

        $scope.enableChassisEdition = () => {
            $scope.editingChassis = true;
        };

        $scope.setChassis = () => {
            statusUpdate({ 'chassis_number': $scope.status.approval.chassis_appointed.data }).then(() => {
                $scope.editingChassis = false;
            });
        };

        $scope.deleteActualProdDate = (form, actual_production_date) => {
            checkValidAndDelete(form, 'del_actual_production_date', actual_production_date);
        };

        $scope.deleteChassisSection = (form, chassis_section) => {
            checkValidAndDelete(form, 'del_chassis_section', chassis_section);
        };

        $scope.deleteBuildingSection = (form, building) => {
            checkValidAndDelete(form, 'del_building', building);
        };


        $scope.deletePrewireSection = (form, prewire_section) => {
            checkValidAndDelete(form, 'del_prewire_section', prewire_section);
        };

        $scope.deletePlumbingDate = (form, plumbing_date) => {
            checkValidAndDelete(form, 'del_plumbing_date', plumbing_date);
        };

        $scope.deleteAluminiumSection = (form, aluminium) => {
            checkValidAndDelete(form, 'del_aluminium', aluminium);
        };

        $scope.deleteFinishing = (form, finishing) => {
            checkValidAndDelete(form, 'del_finishing', finishing);
        };

        $scope.deleteWatertestDate = (form, watertest_date) => {
            checkValidAndDelete(form, 'del_watertest_date', watertest_date);
        };

        $scope.deleteWeighbridgeDate = (form, weigh_bridge_date) => {
            checkValidAndDelete(form, 'del_weigh_bridge_date', weigh_bridge_date);
        };

        $scope.deleteDetailingDate = (form, del_detailing_date) => {
            checkValidAndDelete(form, 'del_detailing_date', del_detailing_date);
        };

        $scope.deleteActualQC = (form, qc_date_actual) => {
            checkValidAndDelete(form, 'del_qc_date_actual', qc_date_actual);
        };

        $scope.deleteFinalQC = (form, final_qc_date) => {
            checkValidAndDelete(form, 'del_final_qc_date', final_qc_date);
        };

        $scope.deleteActualDispatchDate = (form, dispatch_date_actual) => {
            checkValidAndDelete(form, 'del_dispatch_date_actual', dispatch_date_actual);
        };

        $scope.updateActualProductionDate = (form, actual_production_date) => {
            checkValidAndUpdate(form, 'actual_production_date', actual_production_date);
        };



        $scope.updateActualProductionComments = (form, actual_production_comments) => {
            checkValidAndUpdate(form, 'actual_production_comments', actual_production_comments);
        };

        // Chassis section
        $scope.updateChassisSectionDate = (form, chassis_section) => {
            checkValidAndUpdate(form, 'chassis_section', chassis_section);
        };

        $scope.updateChassisSectionComments = (form, chassis_section_comments) => {
            checkValidAndUpdate(form, 'chassis_section_comments', chassis_section_comments);
        };

        // Building
        $scope.updateBuildingDate = (form, building) => {
            checkValidAndUpdate(form, 'building', building);
        };
        $scope.updateBuildingComments = (form, building_comments) => {
            checkValidAndUpdate(form, 'building_comments', building_comments);
        };
        // Prewire
        $scope.updatePrewireDate = (form, prewire_section) => {
            checkValidAndUpdate(form, 'prewire_section', prewire_section);
        };
        $scope.updatePrewireComments = (form, prewire_comments) => {
            checkValidAndUpdate(form, 'prewire_comments', prewire_comments);
        };

        // Plumbing
        $scope.updatePlumbingDate = (form, plumbing_date) => {
            checkValidAndUpdate(form, 'plumbing_date', plumbing_date);
        };

        $scope.updatePlumbingComments = (form, plumbing_comments) => {
            checkValidAndUpdate(form, 'plumbing_comments', plumbing_comments);
        };
        // Aluminium
        $scope.updateAluminiumDate = (form, aluminium) => {
            checkValidAndUpdate(form, 'aluminium', aluminium);
        };
        $scope.updateAluminiumComments = (form, aluminium_comments) => {
            checkValidAndUpdate(form, 'aluminium_comments', aluminium_comments);
        };
        // Finishing
        $scope.updateFinishingDate = (form, finishing) => {
            checkValidAndUpdate(form, 'finishing', finishing);
        };
        $scope.updateFinishingComments = (form, finishing_comments) => {
            checkValidAndUpdate(form, 'finishing_comments', finishing_comments);
        };

        $scope.updateWatertestDate = (form, watertest_date) => {
            checkValidAndUpdate(form, 'watertest_date', watertest_date);
        };
        $scope.updateWatertestComments = (form, watertest_comments) => {
            checkValidAndUpdate(form, 'watertest_comments', watertest_comments);
        };

        $scope.updateWeighbridgeDate = (form, weigh_bridge_date) => {
            checkValidAndUpdate(form, 'weigh_bridge_date', weigh_bridge_date);
        };
        $scope.updateWeighbridgeComments = (form, weigh_bridge_comments) => {
            checkValidAndUpdate(form, 'weigh_bridge_comments', weigh_bridge_comments);
        };

        $scope.updateDetailingDate = (form, detailing_date) => {
            checkValidAndUpdate(form, 'detailing_date', detailing_date);
        };
        $scope.updateDetalingComments = (form, detailing_comments) => {
            checkValidAndUpdate(form, 'detailing_comments', detailing_comments);
        };

        $scope.updatePlannedQcDate = (form, qc_date_planned) => {
            checkValidAndUpdate(form, 'qc_date_planned', qc_date_planned);
        };

        $scope.updateActualQcDate = (form, qc_date_actual) => {
            checkValidAndUpdate(form, 'qc_date_actual', qc_date_actual);
        };

        $scope.updateQCComments = (form, qc_comments) => {
            checkValidAndUpdate(form, 'qc_comments', qc_comments);
        };

        $scope.updatePlannedWatertestDate = (form, planned_watertest_date) => {
            checkValidAndUpdate(form, 'planned_watertest_date', planned_watertest_date);
        };

        $scope.updateActualWatertestDate = (form, actual_watertest_date) => {
            checkValidAndUpdate(form, 'actual_watertest_date', actual_watertest_date);
        };

        $scope.updateWatertestComments = (form, watertest_comments) => {
            checkValidAndUpdate(form, 'watertest_comments', watertest_comments);
        };

        $scope.updateFinalQcDate = (form, final_qc_date) => {
            checkValidAndUpdate(form, 'final_qc_date', final_qc_date);
        };

        $scope.updateFinalQcComments = (form, final_qc_comments) => {
            checkValidAndUpdate(form, 'final_qc_comments', final_qc_comments);
        };

        $scope.updateSeniorDesigner = (form, senior_designer_verfied_date) => {
            checkValidAndUpdate(form, 'senior_designer_verfied_date', senior_designer_verfied_date);
            console.log("Check_designer_date" + senior_designer_verfied_date);

        };
        
        $scope.testdatefun = (form, senior_designer_verfied_date,test_date) => {
                   
                   console.log("senior_designer_verfied_date" + senior_designer_verfied_date);
                   console.log("test_date " + $scope.test_date); 

                   
                    var newdate = new Date(senior_designer_verfied_date);
                    var senior_date = newdate
                
                    newdate.setDate(newdate.getDate() );
                    var dd = newdate.getDate();
                    var mm = newdate.getMonth() + 1;
                    var y = newdate.getFullYear();
                    var senior_Date = dd + '/' + mm + '/' + y;
                    console.log('senior Date ' + senior_Date);
                    $scope.test_date= senior_Date;
                    $scope.senior_designer_verfied_date= senior_Date;
                
        };

//         $scope.loadItem = function(){
//             var senior_designer_verfied_date = parseInt($scope.senior_designer_verfied_date)
//             if(!isNaN(senior_designer_verfied_date)){
//                 $http.get('verified_date' + senior_designer_verfied_date).success(function(data) {
//                     $scope.senior_designer_verfied_date = data;
//     });
//   }
// }

        $scope.seniordatefun1 = (form, senior_designer_verfied_date) => {

                    console.log("senior_designer" + " " +$scope.status['approval']['senior_designer_verfied_date'].data);            

                    console.log("Date for verification " + " " + $scope.senior_designer_verfied_date);

                    console.log("senior_load_date" + " " + senior_designer_verfied_date);
                    
                    $scope.senior_designer_verfied_date = new Date();
                    var senior_date=document.getElementById("senior_designer_verfied_date").value;
                    var date=senior_date.substring(0,2);
                    console.log("senior_date" + " " + date);
                    var month=senior_date.substring(3,5);
                    console.log("senior_month" + " " +  month);
                    var year=senior_date.substring(6,10);
                    console.log("senior_date_year" + " " +  year);
                    var set_Date_senior = new (year,month-1,date)
                    $scope.test_date= set_Date_senior;
                    
        };



         // $scope.seniordatefun = (form, senior_designer_verfied_date) => {

         //            console.log("senior_load_date" + " " + senior_designer_verfied_date);
         //            //var x=$scope.status['approval']['senior_designer_verfied_date'].data;
         //            console.log("const value" + " " + x);
         //            console.log("value" + " " + $status.approval.senior_designer_verfied_date.data);

                    // $scope.senior_designer_verfied_date = new Date();
                    // var senior_date=document.getElementById("senior_designer_verfied_date").value;
                    // var date=senior_date.substring(0,2);
                    // console.log("senior_date" + " " + date);
                    // var month=senior_date.substring(3,5);
                    // console.log("senior_month" + " " +  month);
                    // var year=senior_date.substring(6,10);
                    // console.log("senior_date_year" + " " +  year);
                    // var set_Date_senior = new (year,month-1,date)
                    // $scope.test_date= set_Date_senior;
                    
        };


                    
           


        $scope.updatePurchaseOrderRaised = (form, purchase_order_raised_date) => {
            console.log(" View Senior Permissions : " + $scope.status.permissions.view_status_senior_designer_verfied_date);
            console.log(" update Senior Permissions : " + $scope.status.permissions.can_update_senior_designer_verfied_date);
            console.log(" View Purchase Permissions : " + $scope.status.permissions.view_status_purchase_order_raised_date);
            console.log(" update Purchase Permissions : " + $scope.status.permissions.can_update_purchase_order_raised_date);
            checkValidAndUpdate(form, 'purchase_order_raised_date', purchase_order_raised_date);
        };


        $scope.updateVinNumber = (form, vin_number) => {
            checkValidAndUpdate(form, 'vin_number', vin_number);
        };

        $scope.updatePlannedDispatchDate = (form, dispatch_date_planned) => {
            checkValidAndUpdate(form, 'dispatch_date_planned', dispatch_date_planned);
        };

        $scope.updateActualDispatchDate = (form, dispatch_date_actual) => {
            checkValidAndUpdate(form, 'dispatch_date_actual', dispatch_date_actual);
        };

        $scope.updateDispatchComments = (form, dispatch_comments) => {
            checkValidAndUpdate(form, 'dispatch_comments', dispatch_comments);
        };

        $scope.updateCollectionDate = (form, collection_date) => {
            checkValidAndUpdate(form, 'collection_date', collection_date);
        };

        $scope.updateCollectionComments = (form, collection_comments) => {
            checkValidAndUpdate(form, 'collection_comments', collection_comments);
        };

        $scope.updateDealershipReceivedDate = (form, received_date_dealership) => {
            checkValidAndUpdate(form, 'received_date_dealership', received_date_dealership);
        };

        $scope.chekErr = function(delivery_date_customer) {
            $scope.errMessage = '';
            $scope.noShow = true;
            $scope.curDate = new Date();
            var dateEntered = document.getElementById("delivery_date_customer").value;
            var date = dateEntered.substring(0, 2);
            var month = dateEntered.substring(3, 5);
            var year = dateEntered.substring(6, 10);
            var dateToCompare = new Date(year, month - 1, date)

            if (dateToCompare > $scope.curDate) {
                $scope.errMessage = "Delivery Date should not be greater than current date";
                alert("Delivery Date should not be greater than current date");
                $scope.noShow = false;
                return false;
            }
        };
        $scope.updateCustomerDeliveryDate = (form, delivery_date_customer) => {
            checkValidAndUpdate(form, 'delivery_date_customer', delivery_date_customer);
        };

        $scope.openWeightsModal = () => {
            $scope.status.delivery.new_weights = { data: {...$scope.status.delivery.weights.data } };
            $('#delivery_weights.modal').modal({
                backdrop: 'static',
            });
        };
        $scope.saveWeights = () => {
            statusUpdate({ weights: $scope.status.delivery.new_weights }).then(() => {
                $('#delivery_weights.modal').modal('hide');
            });
        };

        $scope.updateDeliveryDate = (form, delivery_date) => {
            checkValidAndUpdate(form, 'delivery_date', delivery_date);
        };

        $scope.updateDrafter = (form, drafter) => {
            checkValidAndUpdate(form, 'drafter', drafter);
        };

        $scope.cancelFinalization = () => {
            $scope.order_finalization_cancel_reason = '';

            $('#order_finalization_cancel_reason.modal').modal({
                backdrop: 'static',
            });
        };

        $scope.processCancelFinalization = () => {
            $scope.post('cancel-finalize', {
                order_id: $scope.order.id,
                reason: $scope.order_finalization_cancel_reason,
            }).then(r => {
                $state.go('order.status', {}, { reload: true });
            });
        };

        $scope.approveCustomerPlan = () => {
            statusUpdate({
                review_customer_plan: 'approve',
                customer_plan_disclaimer_checked: $scope.status.approval.customer_plan_reviewed.customer_plan_disclaimer_checked,
                weight_estimate_disclaimer_checked: $scope.status.approval.customer_plan_reviewed.weight_estimate_disclaimer_checked,
            });
        };

        $scope.confirmRejectCustomerPlan = () => {
            $scope.customer_plan_reject_reason = '';

            $('#customer_plan_reject_reason.modal').modal({
                backdrop: 'static',
            });
        };

        $scope.processRejectCustomerPlan = () => {
            statusUpdate({
                review_customer_plan: 'reject',
                reject_reason: $scope.customer_plan_reject_reason
            });
        };

        $scope.updateDoc = (form, file_upload, type) => {
            // console.log('Uploaded Doc ' + type + " : " + $scope.certificate_note);
            if ($scope.cert_loading) {
                return;
            }
            $scope.cert_loading = true;
            switch (type) {
                case 'customer':
                    type = 'customer_plan';
                    $scope.certificate_note='Customer Plan';
                    break;
                case 'factory':
                    type = 'factory_plan';
                    $scope.certificate_note='';
                    break;
                case 'chassis':
                    type = 'chassis_plan';
                    $scope.certificate_note='';
                    break;
                case 'contract':
                    type = 'contract';
                    $scope.certificate_note='';
                    break;
                case 'plumbing':
                    type = 'plumbing';
                    break;
                case 'electrical':
                    type = 'electrical';
                    break;
                case 'weighbridge':
                    type = 'weighbridge';
                    break;
                case 'qualitycontrol':
                    type = 'qualitycontrol';
                    break;
                 case 'others':
                    type = 'others';
                    break;
            }

            if (form.$valid) {
                Upload.upload({
                    url: '/api/orders/status-update',
                    data: {
                        order_id: $scope.order.id,
                        certificate_title:$scope.certificate_note,
                        upload_for: type,
                    },
                    file: file_upload,
                }).then(function(response) {
                    // console.log('Response Re entered');
                    refreshStatus();
                    refreshCerts();
                    
                }, function(resp) {}).then(() => {
                    $scope.cert_loading = false;
                    $scope.loading=false;
                    // console.log('Loading Complete Status : ' + $scope.cert_loading);
                });
            }
        };

        $scope.updateSalesforce = () => {
            statusUpdate();
        };

        $scope.checkcertvalue = () => {
            if ($scope.certificate_type == "others")
            {
                return true;
            }else
            {
                return false;
            }
        };

        $scope.populateText = () => {
          
            if($scope.certificate_type=="plumbing")
                $scope.certificate_note ="Plumbing Certificate";
            if($scope.certificate_type=="electrical")
                $scope.certificate_note ="Electrical Certificate";
            if($scope.certificate_type=="weighbridge")
                $scope.certificate_note ="Weigh Bridge Certificate";
            if($scope.certificate_type=="qualitycontrol")
                $scope.certificate_note ="Quality Control Certificate";
            if($scope.certificate_type=="others")
                $scope.certificate_note ="Other Certificates";


        };
                

        $scope.updateSeparateDoc = (plan, type) => {
            if (plan && plan.is_separated) {
                statusUpdate({ add_separate_doc: type });
            } else {
                $scope.deleteDoc(plan.id, type);
            }
        };

        $scope.deleteDoc = (id, type) => {
            $scope.cert_loading=true;
            if (type == 'customer') {
                statusUpdate({ delete_customer_plan: id });
            } else if (type == 'factory') {
                statusUpdate({ delete_factory_plan: id });
            } else if (type == 'chassis') {
                statusUpdate({ delete_chassis_plan: id });
            } else if (type == 'contract') {
                statusUpdate({ delete_contract: id });
            } else if (type == 'handover_to_driver_form') {
                statusUpdate({ delete_handover_to_driver_form: id });
            } else if (type == 'handover_to_dealership_form') {
                statusUpdate({ delete_handover_to_dealership_form: id });
            } else if (type == 'order_certificate_form') {
                statusUpdate({ delete_order_certificate_form: id });
            }
            $scope.cert_loading=false;
        };

        $scope.updateHistory = (form, history) => {
            if (form.$valid && history !== undefined) {
                if (history.file_upload !== undefined) {
                    Upload.upload({
                        url: '/api/orders/status-history-note',
                        data: {
                            order_id: $scope.order.id,
                            note: history.note,
                        },
                        file: history.file_upload,
                    }).then(function(response) {
                        refreshStatus();
                    }, function(resp) {});
                } else if (history.note) {
                    $scope.post('status-history-note', {
                        order_id: $scope.order.id,
                        note: history.note,
                    }).then(r => {
                        refreshStatus();
                    });
                }
                $scope.history = {};
            }
        };

        $scope.updateCertificate = (form, history) => {
            if (form.$valid && history !== undefined) {
                if (history.file_upload !== undefined) {
                    Upload.upload({
                        url: '/api/orders/status-history-note',
                        data: {
                            order_id: $scope.order.id,
                            note: history.note,
                        },
                        file: history.file_upload,
                    }).then(function(response) {
                        refreshStatus();
                    }, function(resp) {});
                } else if (history.note) {
                    $scope.post('status-history-note', {
                        order_id: $scope.order.id,
                        note: history.note,
                    }).then(r => {
                        refreshStatus()
                    });
                }
                $scope.history = {};
            }
        };

        $scope.onOpenUpdateCustomerManager = () => {
            $('#update_customer_manager.modal').modal({
                backdrop: 'static',
            });
        };

        const getCustomerManagerList = () => {
            $scope.post('customer_manager', {
                order_id: $scope.order.id,
            }).then(
                (r) => {
                    $scope.customer_manager_list = r.data.customer_manager_list;
                }
            );
        };

        getCustomerManagerList();

        $scope.updateCustomerManager = () => {
            if (!$scope.new_customer_manager_id) {
                return;
            }
            $scope.post('customer_manager', {
                order_id: $scope.order.id,
                customer_manager_id: $scope.new_customer_manager_id
            }).then(
                (r) => {
                    $scope.order.customer_manager_name = r.data.name;
                }
            );
        };

        $scope.canChangeSalesRep = () => {
            return $scope.order.permissions && $scope.order.permissions.modify_order_sales_rep;
        };

         $scope.canDeleteCertificates = () => {
            // console.log('Senior View ' + $scope.status.permissions.view_status_senior_designer_verfied_date);
            // console.log('Senior Update ' + $scope.status.permissions.can_update_senior_designer_verfied_date);
            // console.log('Purchase View ' + $scope.status.permissions.view_status_purchase_order_raise_date);
            // console.log('Purchase Update ' + $scope.status.permissions.can_update_purchase_order_raised_date);
            // console.log('Delete ' + $scope.status.permissions.can_delete_certificates);
            return  $scope.status.permissions.can_delete_certificates;
        };

        $scope.onOpenUpdateSalesRep = () => {
            $('#update_sales_rep.modal').modal({
                backdrop: 'static',
            });
        };

        const getSalesRepList = () => {
            if ($scope.canChangeSalesRep()) {
                $scope.post('sales_rep', {
                    order_id: $scope.order.id,
                }).then(
                    (r) => {
                        $scope.sales_rep_list = r.data.sales_rep_list;
                    }
                );
            }
        };

        getSalesRepList();

        $scope.updateSalesRep = () => {
            if (!$scope.new_sales_rep_id) {
                return;
            }
            $scope.post('sales_rep', {
                order_id: $scope.order.id,
                sales_rep_id: $scope.new_sales_rep_id,
            }).then(
                (r) => {
                    $scope.order.dealer_sales_rep_name = r.data.name;
                }
            );
        };
    });
}