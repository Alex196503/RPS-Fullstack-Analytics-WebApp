import { ObjectId } from "mongodb"
import { Types, type PipelineStage } from "mongoose"
//File that contains the aggregation pipeline for the match stats

//Combined aggregation pipeline to get the most used player move and the advanced mode ratio
export const getCombinedDashboardStats = (
  idUser: string
): PipelineStage[] => [
  {
    $match: {
      user: new Types.ObjectId(idUser)
    }
  },
  {
    $facet: {
      favoriteMoveBranch: [
        {
          $group: {
            _id: "$playerMove",
            counter: { $sum: 1 }
          }
        },
        { $sort: { counter: -1 } },
        { $limit: 1 }
      ],
      advancedRatioBranch: [
        {
          $group: {
            _id: "$user",
            totalMatches: { $sum: 1 },
            advancedMatches: {
              $sum: {
                $cond: {
                  if: { $eq: ["$mode", "advanced"] },
                  then: 1,
                  else: 0
                }
              }
            }
          }
        },
        {
          $project: {
            advancedPercentage: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ["$advancedMatches", "$totalMatches"]
                    },
                    100
                  ]
                },
                2
              ]
            }
          }
        }
      ]
    }
  }
]

//Simple pipeline to get the total number of wins, losses, draws, and the number of advanced and classic matches
export const getSimpleStats = (idUser: string): PipelineStage[] => [
  {
    $match: {
      user: new Types.ObjectId(idUser)
    }
  },
  {
    $group: {
      _id: "$user",
      advancedCount: {
        $sum: {
          $cond: {
            if: {
              $eq: ["$mode", "advanced"]
            },
            then: 1,
            else: 0
          }
        }
      },
      classicCount: {
        $sum: {
          $cond: {
            if: {
              $eq: ["$mode", "classic"]
            },
            then: 1,
            else: 0
          }
        }
      },
      winCount: {
        $sum: { $cond: [{ $eq: ["$result", "win"] }, 1, 0] }
      },
      lossCount: {
        $sum: { $cond: [{ $eq: ["$result", "loss"] }, 1, 0] }
      },
      drawCount: {
        $sum: { $cond: [{ $eq: ["$result", "draw"] }, 1, 0] }
      }
    }
  }
]
