import { FormGroup, FormControlLabel, Switch } from "@mui/material";
import MDTypography from "components/MDTypography";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MDBox from "components/MDBox";
import Icon from "@mui/material/Icon";
import { useChartOrder } from "context/chartOrderContext";
import PropTypes from "prop-types";

function ChartsSelection({ darkMode, sidenavColor, chartsData, updateChartVisibility }) {
  const { chartOrder, updateChartOrder } = useChartOrder();

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(chartOrder);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    updateChartOrder(newOrder);
  };

  return (
    <>
      <MDTypography variant="h6" color={darkMode ? "white" : "dark"} mt={2}>
        Charts
      </MDTypography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chart-selection">
          {(provided) => (
            <FormGroup {...provided.droppableProps} ref={provided.innerRef}>
              {chartOrder
                .map((index) => chartsData[index])
                .filter(Boolean)
                .map((chart, index) => (
                  <Draggable key={chart.title} draggableId={chart.title} index={index}>
                    {(provided, snapshot) => (
                      <MDBox
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          transition: "transform 0.2s",
                          transform: snapshot.isDragging ? "scale(1.02)" : "scale(1)",
                          backgroundColor: snapshot.isDragging ? "rgba(0,0,0,0.05)" : "transparent",
                          borderRadius: "8px",
                          mb: 0.5,
                        }}
                      >
                        <FormControlLabel
                          sx={{
                            width: "100%",
                            m: 0,
                            p: 1,
                          }}
                          control={
                            <Switch
                              color={sidenavColor}
                              checked={chart.visible}
                              onChange={() => updateChartVisibility(chart.title)}
                              name={chart.title}
                              size="small"
                            />
                          }
                          label={
                            <MDBox display="flex" alignItems="center" width="100%" {...provided.dragHandleProps}>
                              <MDTypography variant="button" fontWeight="regular" color={darkMode ? "white" : "dark"}>
                                {chart.title}
                              </MDTypography>
                              <Icon
                                sx={{
                                  ml: "auto",
                                  color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
                                  fontSize: "1.1rem",
                                }}
                              >
                                drag_indicator
                              </Icon>
                            </MDBox>
                          }
                        />
                      </MDBox>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </FormGroup>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

ChartsSelection.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  sidenavColor: PropTypes.string.isRequired,
  chartsData: PropTypes.array.isRequired,
  updateChartVisibility: PropTypes.func.isRequired,
};

export default ChartsSelection; 