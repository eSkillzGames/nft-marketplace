import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CFormRange,
} from '@coreui/react'
import { CChartLine, CChartDoughnut, CChart } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload } from '@coreui/icons'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const baseURL = ''

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  const [mintData, setMintData] = useState({})
  const [earnData, setEarnData] = useState({})
  const [mintActive, setMintActive] = useState([false, true, false])
  const [earnActive, setEarnActive] = useState([false, true, false])

  const progressExample = [
    { title: 'Total Earn', value: '$ 29.703', percent: 40, color: 'success' },
    { title: 'Total Mint', value: '$ 24.093', percent: 20, color: 'info' },
    { title: 'Bet Earn', value: '$ 78.706', percent: 60, color: 'warning' },
    { title: 'Tournaments Earn', value: '$ 22.123', percent: 80, color: 'danger' },
  ]

  useEffect(async () => {
    var mint = (await axios.get(baseURL + '/getmintgraph?type=month')).data
    var earn = (await axios.get(baseURL + '/getearngraph?type=month')).data

    setMintData(mint)
    setEarnData(earn)
  }, [])

  async function onMintDate(type, index) {
    var tmp = [false, false, false]
    var mint = (await axios.get(baseURL + '/getmintgraph?type=' + type)).data

    tmp[index] = true
    setMintActive(tmp)
    setMintData(mint)
  }

  async function onEarnDate(type, index) {
    var tmp = [false, false, false]
    var earn = (await axios.get(baseURL + '/getearngraph?type=' + type)).data

    tmp[index] = true
    setEarnActive(tmp)
    setEarnData(earn)
  }

  return (
    <>
      {/* <WidgetsDropdown /> */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
                Total Mint
              </h4>
              <div className="small text-medium-emphasis">{mintData.from} ~ {mintData.to}</div>
            </CCol>
            <CCol sm={6} style={{textAlign: 'right'}}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (mintActive[0] == true ? 'active' : '')} onClick={() => onMintDate('week', 0)}>Weekly</CButton>
                <CButton color={"primary " + (mintActive[1] == true ? 'active' : '')} onClick={() => onMintDate('month', 1)}>Monthly</CButton>
                <CButton color={"primary " + (mintActive[2] == true ? 'active' : '')} onClick={() => onMintDate('year', 2)}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: mintData.labels,
              datasets: [
                {
                  label: 'Mint(CUE)',
                  backgroundColor: 'rgb(74, 193, 142)',
                  data: mintData.mint,
                },
              ],
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>
                  {item.value} ({item.percent}%)
                </strong>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={6}>
              <h4 id="traffic" className="card-title mb-0">
                Total Earn
              </h4>
              <div className="small text-medium-emphasis">{earnData.from} ~ {earnData.to}</div>
            </CCol>
            <CCol sm={6} style={{textAlign: 'right'}}>
              <CButtonGroup role="group" aria-label="">
                <CButton color={"primary " + (earnActive[0] == true ? 'active' : '')} onClick={() => onEarnDate('week', 0)}>Weekly</CButton>
                <CButton color={"primary " + (earnActive[1] == true ? 'active' : '')} onClick={() => onEarnDate('month', 1)}>Monthly</CButton>
                <CButton color={"primary " + (earnActive[2] == true ? 'active' : '')} onClick={() => onEarnDate('year', 2)}>Annual</CButton>
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChart
            type="bar"
            height={100}
            data={{
              labels: earnData.labels,
              datasets: [
                {
                  label: 'Earn(CUE)',
                  backgroundColor: 'rgb(255, 187, 68)',
                  data: earnData.earn,
                },
              ],
            }}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      console.log(context)
                      let label = context.dataset.label || '';

                      if (label) {
                        label += ': $';
                      }
                      if (context.parsed.y !== null) {
                        label += context.parsed.y.toFixed(10);
                      }
                      return label;
                    }
                  }
                }
              }
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 4 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>
                  {item.value} ({item.percent}%)
                </strong>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <CRow>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Total Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Earn'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#4ac18e'],
                      data: [40, 60],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 green-range" defaultValue="60" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#4ac18e', border: '1px solid #4ac18e' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Total Mint</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Mint'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#ffbb44'],
                      data: [30, 70],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 yellow-range" defaultValue="70" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#ffbb44', border: '1px solid #ffbb44' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Betting Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Total Mint'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#8d6e63'],
                      data: [80, 20],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 brown-range" defaultValue="20" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#8d6e63', border: '1px solid #8d6e63' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard className="mb-4">
            <CCardHeader>Tournaments Earn</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: ['', 'Tournaments Earn'],
                  datasets: [
                    {
                      backgroundColor: ['#FFFFFF', '#90a4ae'],
                      data: [90, 10],
                    },
                  ],
                }}
              />
              <CFormRange min="0" max="100" className="mt-4 gray-range" defaultValue="10" />
              <CButton style={{ margin: '0px auto', display: 'block', background: '#90a4ae', border: '1px solid #90a4ae' }}>Save</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
